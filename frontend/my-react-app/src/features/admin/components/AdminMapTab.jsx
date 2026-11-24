import { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORIES = ['All', 'Road', 'Water', 'Streetlight', 'Garbage', 'Pothole', 'Sanitation'];
const STATUSES = ['All', 'Reported', 'In Progress', 'Resolved'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

// Format date helper
function fmtDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return '—';
    }
}

// Safely extract [latitude, longitude] from issue
// Reminder: GeoJSON coordinates are [longitude, latitude], Leaflet expects [latitude, longitude]
function extractLatLng(issue) {
    if (!issue) return null;

    // Check GeoJSON point: [lng, lat]
    if (
        issue.geoLocation &&
        Array.isArray(issue.geoLocation.coordinates) &&
        issue.geoLocation.coordinates.length >= 2
    ) {
        const [lng, lat] = issue.geoLocation.coordinates;
        const numLat = Number(lat);
        const numLng = Number(lng);
        if (
            Number.isFinite(numLat) &&
            Number.isFinite(numLng) &&
            numLat >= -90 && numLat <= 90 &&
            numLng >= -180 && numLng <= 180
        ) {
            return [numLat, numLng];
        }
    }

    // Direct latitude & longitude fields fallback
    if (issue.latitude !== undefined && issue.longitude !== undefined) {
        const numLat = Number(issue.latitude);
        const numLng = Number(issue.longitude);
        if (
            Number.isFinite(numLat) &&
            Number.isFinite(numLng) &&
            numLat >= -90 && numLat <= 90 &&
            numLng >= -180 && numLng <= 180
        ) {
            return [numLat, numLng];
        }
    }

    return null;
}

// Generate colored custom marker icons based on issue status & priority
function createMarkerIcon(status) {
    let bgColor = '#ef4444'; // Reported: Red
    let pulseColor = 'rgba(239, 68, 68, 0.3)';
    let symbol = '🚨';

    if (status === 'In Progress') {
        bgColor = '#3b82f6'; // In Progress: Blue
        pulseColor = 'rgba(59, 130, 246, 0.3)';
        symbol = '⏳';
    } else if (status === 'Resolved') {
        bgColor = '#10b981'; // Resolved: Green
        pulseColor = 'rgba(16, 185, 129, 0.3)';
        symbol = '✓';
    }

    const html = `
        <div style="position: relative; width: 34px; height: 38px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; top: 0; width: 32px; height: 32px; border-radius: 50%; background: ${pulseColor}; animation: pulse 2s infinite;"></div>
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${bgColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: bold; z-index: 2;">
                ${symbol}
            </div>
            <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${bgColor}; margin-top: -2px; z-index: 1;"></div>
        </div>
    `;

    return L.divIcon({
        className: 'custom-admin-marker',
        html,
        iconSize: [34, 38],
        iconAnchor: [17, 36],
        popupAnchor: [0, -34],
    });
}

// Auto-fit bounds component
function FitBounds({ positions }) {
    const map = useMap();
    useEffect(() => {
        if (!map || positions.length === 0) return;
        if (positions.length === 1) {
            map.flyTo(positions[0], 14, { animate: true, duration: 0.8 });
        } else {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
        }
    }, [positions, map]);
    return null;
}

// Controller to programmatic flyTo selected marker
function MapController({ targetPos }) {
    const map = useMap();
    useEffect(() => {
        if (targetPos && map) {
            map.flyTo(targetPos, 15, { animate: true, duration: 0.6 });
        }
    }, [targetPos, map]);
    return null;
}

export default function AdminMapTab({
    issues = [],
    loading = false,
    error = '',
    onStatusChange,
    onSelectIssue,
    updatingId = '',
}) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [targetPos, setTargetPos] = useState(null);
    const markerRefs = useRef({});

    // Filter issues with valid geo coordinates
    const geoTaggedIssues = useMemo(() => {
        return issues
            .map((issue) => ({
                issue,
                latLng: extractLatLng(issue),
            }))
            .filter((item) => item.latLng !== null);
    }, [issues]);

    // Apply active user filters
    const filteredIssues = useMemo(() => {
        return geoTaggedIssues.filter(({ issue }) => {
            if (statusFilter !== 'All' && issue.status !== statusFilter) return false;
            if (categoryFilter !== 'All' && issue.category !== categoryFilter) return false;
            if (priorityFilter !== 'All' && issue.priority !== priorityFilter) return false;
            if (search.trim()) {
                const q = search.toLowerCase();
                const matchTitle = issue.title?.toLowerCase().includes(q);
                const matchLoc = issue.location?.toLowerCase().includes(q);
                const matchDesc = issue.description?.toLowerCase().includes(q);
                if (!matchTitle && !matchLoc && !matchDesc) return false;
            }
            return true;
        });
    }, [geoTaggedIssues, statusFilter, categoryFilter, priorityFilter, search]);

    const allPositions = useMemo(() => {
        return filteredIssues.map((item) => item.latLng);
    }, [filteredIssues]);

    // Statistics counts
    const counts = useMemo(() => {
        const total = geoTaggedIssues.length;
        const reported = geoTaggedIssues.filter((i) => i.issue.status === 'Reported').length;
        const inProgress = geoTaggedIssues.filter((i) => i.issue.status === 'In Progress').length;
        const resolved = geoTaggedIssues.filter((i) => i.issue.status === 'Resolved').length;
        const unlocated = issues.length - total;
        return { total, reported, inProgress, resolved, unlocated };
    }, [geoTaggedIssues, issues.length]);

    // Center map on specific issue when clicked in the side list
    const handleFocusIssue = (item) => {
        setSelectedIssueId(item.issue._id);
        setTargetPos(item.latLng);
        const marker = markerRefs.current[item.issue._id];
        if (marker) {
            marker.openPopup();
        }
    };

    // Default map center fallback (Faridabad / Delhi NCR or India center)
    const defaultCenter = allPositions.length > 0 ? allPositions[0] : [28.4089, 77.3178];

    return (
        <div className="space-y-4">
            <ErrorBanner message={error} />

            {/* Header & Metric Summary */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-base">
                            🗺️
                        </span>
                        <h2 className="text-lg font-bold text-slate-900">
                            Civic Issue Operations Map
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Live geographical distribution of citizen complaints across wards and sectors.
                    </p>
                </div>

                {/* Quick stats pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-slate-600"></span>
                        Total Pin: <strong className="text-slate-900">{counts.total}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-1.5 text-rose-700 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                        Reported: <strong>{counts.reported}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-blue-700 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        In Progress: <strong>{counts.inProgress}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-emerald-700 shadow-2xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Resolved: <strong>{counts.resolved}</strong>
                    </span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs sm:grid-cols-2 lg:grid-cols-5">
                {/* Search */}
                <div className="relative lg:col-span-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search title, street, locality..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                Status: {s}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                Category: {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority Filter */}
                <div>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>
                                Priority: {p}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Content Area: Map + Side List */}
            {loading ? (
                <div className="flex h-96 items-center justify-center rounded-2xl bg-white shadow-xs">
                    <Spinner />
                </div>
            ) : geoTaggedIssues.length === 0 ? (
                /* Helpful Empty State when no issues have coordinates */
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                        📍
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900">
                        No Geo-Tagged Issues Yet
                    </h3>
                    <p className="mx-auto mt-1 max-w-md text-xs text-slate-500">
                        Currently none of the reported issues contain GPS coordinates. As citizens report complaints using the map picker, they will automatically appear here as interactive pins.
                    </p>
                    {counts.unlocated > 0 && (
                        <p className="mt-3 text-xs font-medium text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-lg border border-amber-200/60">
                            ℹ️ {counts.unlocated} issue(s) are logged with text addresses only.
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                    {/* Map Container */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-3 min-h-[450px] sm:min-h-[580px] lg:min-h-[640px]">
                        <MapContainer
                            center={defaultCenter}
                            zoom={12}
                            scrollWheelZoom={true}
                            style={{ width: '100%', height: '100%', minHeight: '450px' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <FitBounds positions={allPositions} />
                            <MapController targetPos={targetPos} />

                            {filteredIssues.map(({ issue, latLng }) => {
                                const icon = createMarkerIcon(issue.status);

                                return (
                                    <Marker
                                        key={issue._id}
                                        position={latLng}
                                        icon={icon}
                                        ref={(ref) => {
                                            if (ref) markerRefs.current[issue._id] = ref;
                                        }}
                                        eventHandlers={{
                                            click: () => setSelectedIssueId(issue._id),
                                        }}
                                    >
                                        <Popup className="custom-issue-popup" minWidth={260} maxWidth={320}>
                                            <div className="p-1 space-y-2 text-slate-800">
                                                {/* Header: Title + Category */}
                                                <div>
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                                                            {issue.category}
                                                        </span>
                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                                issue.priority === 'High'
                                                                    ? 'bg-rose-100 text-rose-700'
                                                                    : issue.priority === 'Medium'
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-emerald-100 text-emerald-700'
                                                            }`}
                                                        >
                                                            {issue.priority} Priority
                                                        </span>
                                                    </div>
                                                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                                        {issue.title}
                                                    </h4>
                                                </div>

                                                {/* Image Thumbnail if available */}
                                                {issue.image && (
                                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                                        <img
                                                            src={issue.image}
                                                            alt={issue.title}
                                                            className="h-28 w-full object-cover hover:scale-105 transition-transform duration-200"
                                                        />
                                                    </div>
                                                )}

                                                {/* Description */}
                                                <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                                                    {issue.description}
                                                </p>

                                                {/* Location Address */}
                                                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                                    <span className="text-slate-400">📍</span>
                                                    <span className="line-clamp-2">{issue.location}</span>
                                                </div>

                                                {/* Reporter & Date */}
                                                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                                                    <span>👤 {issue.createdBy?.name || 'Citizen'}</span>
                                                    <span>{fmtDate(issue.createdAt)}</span>
                                                </div>

                                                {/* Status Action Form */}
                                                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                            Update Status:
                                                        </label>
                                                        <select
                                                            value={issue.status}
                                                            disabled={updatingId === issue._id}
                                                            onChange={(e) => {
                                                                if (typeof onStatusChange === 'function') {
                                                                    onStatusChange(issue._id, e.target.value);
                                                                }
                                                            }}
                                                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 disabled:opacity-50 cursor-pointer"
                                                        >
                                                            <option value="Reported">Reported</option>
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Resolved">Resolved</option>
                                                        </select>
                                                    </div>

                                                    {/* View in Issues Tab Button */}
                                                    {typeof onSelectIssue === 'function' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onSelectIssue(issue._id)}
                                                            className="w-full mt-1 flex items-center justify-center gap-1 rounded-lg bg-indigo-50 px-2 py-1.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                                                        >
                                                            <span>📋</span>
                                                            <span>Manage in Issue Table</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>

                        {/* Floating Map Legend */}
                        <div className="absolute bottom-4 left-4 z-[500] rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 text-[11px] font-semibold text-slate-700 shadow-lg backdrop-blur-md flex items-center gap-3">
                            <span className="flex items-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                                Reported
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                                In Progress
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                                Resolved
                            </span>
                        </div>
                    </div>

                    {/* Right Side: Geo-tagged Issue List Feed */}
                    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm max-h-[640px]">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Pinned Issues ({filteredIssues.length})
                            </h3>
                            {(statusFilter !== 'All' || categoryFilter !== 'All' || priorityFilter !== 'All' || search) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter('All');
                                        setCategoryFilter('All');
                                        setPriorityFilter('All');
                                        setSearch('');
                                    }}
                                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        {/* Issue Cards Scrollable List */}
                        <div className="mt-2.5 space-y-2 overflow-y-auto pr-1 flex-1">
                            {filteredIssues.length === 0 ? (
                                <p className="py-8 text-center text-xs text-slate-400">
                                    No issues match your current filters.
                                </p>
                            ) : (
                                filteredIssues.map(({ issue, latLng }) => {
                                    const isSelected = selectedIssueId === issue._id;
                                    return (
                                        <div
                                            key={issue._id}
                                            onClick={() => handleFocusIssue({ issue, latLng })}
                                            className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                                                isSelected
                                                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                                                    : 'border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-slate-100/70'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-1.5">
                                                <h4 className="text-xs font-bold text-slate-900 truncate flex-1">
                                                    {issue.title}
                                                </h4>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold shrink-0 ${
                                                        issue.status === 'Resolved'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : issue.status === 'In Progress'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-rose-100 text-rose-700'
                                                    }`}
                                                >
                                                    {issue.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[11px] text-slate-500 truncate">
                                                📍 {issue.location}
                                            </p>

                                            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                                                <span className="font-medium text-slate-600">{issue.category}</span>
                                                <span>Lat: {latLng[0].toFixed(3)}, Lng: {latLng[1].toFixed(3)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
