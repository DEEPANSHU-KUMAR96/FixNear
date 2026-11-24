import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default Leaflet marker icon (broken in bundlers by default)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/** Inner component: handles map click events */
function MapClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng);
        },
    });
    return null;
}

/** Inner component: syncs marker position when coords change externally */
function DraggableMarker({ position, onDragEnd }) {
    const markerRef = useRef(null);

    const handleDragEnd = () => {
        const marker = markerRef.current;
        if (marker) {
            const latlng = marker.getLatLng();
            onDragEnd(latlng);
        }
    };

    return (
        <Marker
            position={position}
            draggable
            ref={markerRef}
            eventHandlers={{ dragend: handleDragEnd }}
        />
    );
}

/** Re-centers map when center or zoom changes (e.g. on geocoding selection) */
function RecenterMap({ center, zoomLevel }) {
    const map = useMapEvents({});
    useEffect(() => {
        if (center) {
            const targetZoom = zoomLevel || (map.getZoom() < 14 ? 16 : map.getZoom());
            map.flyTo(center, targetZoom, { animate: true, duration: 0.8 });
        }
    }, [center, zoomLevel, map]);
    return null;
}

/**
 * MapLocationPicker
 *
 * Props:
 *   latitude   {number|null} – controlled selected latitude
 *   longitude  {number|null} – controlled selected longitude
 *   zoom       {number} – optional target zoom level (default: 16)
 *   onChange   {(lat, lng) => void} – called whenever the pin moves
 *   defaultCenter {[lat, lng]} – fallback map center (default: India center)
 *   height     {string} – CSS height of the map (default: "280px")
 */
export default function MapLocationPicker({
    latitude,
    longitude,
    zoom = 16,
    onChange,
    defaultCenter = [20.5937, 78.9629],
    height = '280px',
}) {
    const hasSelection = latitude !== null && latitude !== undefined &&
        longitude !== null && longitude !== undefined;

    const position = hasSelection ? [latitude, longitude] : null;

    const handleSelect = ({ lat, lng }) => {
        onChange(parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6)));
    };

    return (
        <div className="space-y-2">
            {/* Map header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Pin on Map
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">(Optional)</span>
                </div>
                {hasSelection && (
                    <button
                        type="button"
                        onClick={() => onChange(null, null)}
                        className="text-[11px] text-rose-500 hover:text-rose-700 font-semibold transition cursor-pointer"
                    >
                        ✕ Clear pin
                    </button>
                )}
            </div>

            {/* Instruction banner */}
            <p className="text-[11px] text-slate-500 leading-snug">
                {hasSelection
                    ? '📍 Drag the pin or click elsewhere to adjust the exact location.'
                    : '👆 Click anywhere on the map or pick an address above to place a marker.'}
            </p>

            {/* Leaflet Map */}
            <div
                className="w-full overflow-hidden rounded-xl border border-slate-200 shadow-xs"
                style={{ height }}
            >
                <MapContainer
                    center={position ?? defaultCenter}
                    zoom={position ? (zoom || 16) : 5}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-xl"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler onSelect={handleSelect} />

                    {position && (
                        <>
                            <DraggableMarker position={position} onDragEnd={handleSelect} />
                            <RecenterMap center={position} zoomLevel={zoom} />
                        </>
                    )}
                </MapContainer>
            </div>

            {/* Coordinates display */}
            {hasSelection && (
                <div className="flex items-center gap-3 p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs font-medium text-emerald-800">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                        <span className="font-semibold">Lat:</span> {latitude.toFixed(5)}&nbsp;&nbsp;
                        <span className="font-semibold">Lng:</span> {longitude.toFixed(5)}
                    </span>
                </div>
            )}
        </div>
    );
}
