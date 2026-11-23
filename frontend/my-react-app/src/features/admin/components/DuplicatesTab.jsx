import { useState, useMemo, Fragment } from 'react';
import { checkDuplicates } from '../../ai/services/ai.service';
import Spinner from './Spinner';
import ErrorBanner from './ErrorBanner';

const SIMILARITY_STYLES = {
    High: { badge: 'bg-red-100 text-red-700 border border-red-200', dot: 'bg-red-500' },
    Medium: { badge: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
    Low: { badge: 'bg-slate-100 text-slate-600 border border-slate-200', dot: 'bg-slate-400' },
};

const STATUS_STYLES = {
    Reported: 'bg-orange-100 text-orange-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
};

const PRIORITY_STYLES = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-slate-100 text-slate-600',
};

const CATEGORY_FAMILY = {
    Garbage: 'Garbage & Sanitation',
    Sanitation: 'Garbage & Sanitation',
    Road: 'Road & Potholes',
    Pothole: 'Road & Potholes',
    Water: 'Water & Drainage',
    Drainage: 'Water & Drainage',
    Streetlight: 'Streetlight & Electricity',
};

function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DuplicatesTab({ issues, loading, onDelete, updatingId }) {
    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState('');
    const [scanError, setScanError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [aiResults, setAiResults] = useState({}); // { [issueId]: { hasDuplicates, duplicates, error } }
    const [checkingId, setCheckingId] = useState('');

    const categories = ['All', 'Garbage', 'Road', 'Streetlight', 'Water', 'Pothole', 'Sanitation'];

    // 1. Identify suspicious duplicate clusters by matching related categories & location
    const clusters = useMemo(() => {
        if (!issues || issues.length === 0) return [];

        const filtered = selectedCategory === 'All'
            ? issues
            : issues.filter((i) => {
                const family = CATEGORY_FAMILY[i.category] || i.category;
                const targetFamily = CATEGORY_FAMILY[selectedCategory] || selectedCategory;
                return family === targetFamily || i.category === selectedCategory;
            });

        const map = new Map();

        filtered.forEach((issue) => {
            const family = CATEGORY_FAMILY[issue.category] || issue.category;
            // Extract primary location keywords (e.g. "ballabgarh ward")
            const locKey = (issue.location || '')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, ' ')
                .trim()
                .split(/\s+/)
                .filter((w) => w.length >= 3)
                .slice(0, 2)
                .join(' ');

            const groupKey = `${family}__${locKey || 'common'}`;

            if (!map.has(groupKey)) {
                map.set(groupKey, []);
            }
            map.get(groupKey).push(issue);
        });

        // Only keep groups with 2 or more issues (potential duplicates)
        return Array.from(map.values()).filter((group) => group.length > 1);
    }, [issues, selectedCategory]);

    // Check a single issue with AI
    const checkSingleIssueWithAi = async (issue) => {
        setCheckingId(issue._id);
        setScanError('');
        try {
            const res = await checkDuplicates({
                title: issue.title,
                description: issue.description,
                category: issue.category,
                location: issue.location,
                excludeIssueId: issue._id,
            });

            // Make sure the issue itself is not in duplicates
            const filteredDups = (res.duplicates || []).filter((d) => d.issueId !== issue._id);

            setAiResults((prev) => ({
                ...prev,
                [issue._id]: {
                    hasDuplicates: filteredDups.length > 0,
                    duplicates: filteredDups,
                    timestamp: new Date(),
                },
            }));
            return filteredDups;
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'AI check failed';
            setAiResults((prev) => ({
                ...prev,
                [issue._id]: {
                    hasDuplicates: false,
                    duplicates: [],
                    error: msg,
                },
            }));
            setScanError(`Issue "${issue.title}": ${msg}`);
            return [];
        } finally {
            setCheckingId('');
        }
    };

    // Run AI scan on all suspected duplicate clusters
    const handleScanAll = async () => {
        if (!issues.length) return;
        setScanning(true);
        setScanError('');
        setScanProgress('Preparing issues for scan...');

        // Prioritize scanning issues that share location/category
        const candidatesMap = new Map();
        clusters.forEach((group) => {
            group.forEach((iss) => candidatesMap.set(iss._id, iss));
        });

        // If no clusters found, take unresolved issues
        let targetList = Array.from(candidatesMap.values());
        if (targetList.length === 0) {
            targetList = issues.filter((i) => i.status !== 'Resolved').slice(0, 8);
        } else {
            targetList = targetList.slice(0, 10);
        }

        const newResults = {};
        let errorsCount = 0;

        for (let i = 0; i < targetList.length; i++) {
            const issue = targetList[i];
            setScanProgress(`Checking ${i + 1} of ${targetList.length}: "${issue.title.slice(0, 25)}..."`);

            try {
                const res = await checkDuplicates({
                    title: issue.title,
                    description: issue.description,
                    category: issue.category,
                    location: issue.location,
                    excludeIssueId: issue._id,
                });

                const filteredDups = (res.duplicates || []).filter((d) => d.issueId !== issue._id);
                newResults[issue._id] = {
                    hasDuplicates: filteredDups.length > 0,
                    duplicates: filteredDups,
                };
            } catch (err) {
                errorsCount++;
                const msg = err.response?.data?.message || err.message || 'Failed';
                newResults[issue._id] = {
                    hasDuplicates: false,
                    duplicates: [],
                    error: msg,
                };
            }
        }

        if (errorsCount > 0) {
            setScanError(`${errorsCount} issue check(s) encountered backend errors. Please check backend logs or model quota.`);
        }

        setAiResults((prev) => ({ ...prev, ...newResults }));
        setScanned(true);
        setScanning(false);
        setScanProgress('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this duplicate issue permanently? This cannot be undone.')) return;
        try {
            await onDelete(id);
            // Clean up from state
            setAiResults((prev) => {
                const next = { ...prev };
                delete next[id];
                Object.keys(next).forEach((key) => {
                    if (next[key]?.duplicates) {
                        next[key].duplicates = next[key].duplicates.filter((d) => d.issueId !== id);
                        next[key].hasDuplicates = next[key].duplicates.length > 0;
                    }
                });
                return next;
            });
        } catch (e) {
            alert(e.message || 'Failed to delete');
        }
    };

    // Calculate detected duplicates summary
    const aiDetectedCount = useMemo(() => {
        return Object.values(aiResults).filter((r) => r.hasDuplicates && r.duplicates?.length > 0).length;
    }, [aiResults]);

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <span>🔍</span> Duplicate Complaint Management
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Detect, compare, and remove duplicate civic reports using location clustering and AI verification.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={handleScanAll}
                            disabled={scanning || loading || issues.length === 0}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {scanning ? (
                                <>
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>✨ Scan All with AI</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Category:</span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                                selectedCategory === cat
                                    ? 'bg-slate-900 text-white font-semibold'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error banner */}
            {scanError && <ErrorBanner message={scanError} />}

            {/* Scanning progress */}
            {scanning && (
                <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-xs sm:text-sm text-indigo-800 flex items-center gap-3">
                    <svg className="w-5 h-5 animate-spin text-indigo-600 shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <div>
                        <p className="font-semibold">{scanProgress}</p>
                        <p className="text-[11px] text-indigo-600 mt-0.5">Calling Groq AI to match problem meaning, location, and severity...</p>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading && <Spinner />}

            {/* AI Confirmed Duplicates Banner */}
            {aiDetectedCount > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⚠️</span>
                        <div>
                            <p className="text-sm font-bold text-rose-900">
                                AI Confirmed {aiDetectedCount} Issue{aiDetectedCount > 1 ? 's' : ''} With Duplicates
                            </p>
                            <p className="text-xs text-rose-700">Review the matches below and delete redundant tickets to prevent duplicate dispatch.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Section 1: Suspected Clusters & AI Match Cards */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span>👥</span> Location & Category Clusters ({clusters.length} suspicious groups)
                    </h3>
                    <span className="text-xs text-slate-400">Issues at the same landmark or category</span>
                </div>

                {clusters.length === 0 ? (
                    <div className="rounded-2xl bg-white border border-slate-100 p-8 text-center text-slate-400">
                        <p className="text-2xl mb-1">✅</p>
                        <p className="text-sm font-semibold text-slate-700">No Multi-Complaint Clusters Found</p>
                        <p className="text-xs mt-1">No two complaints share identical location landmarks under &quot;{selectedCategory}&quot;.</p>
                    </div>
                ) : (
                    clusters.map((group, groupIdx) => {
                        const firstIssue = group[0];
                        return (
                            <div
                                key={groupIdx}
                                className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden"
                            >
                                {/* Cluster Header */}
                                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 flex-wrap">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                                            Cluster #{groupIdx + 1}
                                        </span>
                                        <span className="text-xs font-bold text-slate-800">
                                            📂 {firstIssue.category}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            📍 {firstIssue.location}
                                        </span>
                                        <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                                            {group.length} complaints
                                        </span>
                                    </div>
                                </div>

                                {/* Complaints inside this cluster */}
                                <div className="divide-y divide-slate-100">
                                    {group.map((issue) => {
                                        const aiData = aiResults[issue._id];
                                        const isChecking = checkingId === issue._id;
                                        const isDeleting = updatingId === issue._id;

                                        return (
                                            <div key={issue._id} className="p-4 sm:p-5 space-y-3">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                                    <div className="space-y-1 min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="text-sm font-bold text-slate-900 truncate">
                                                                {issue.title}
                                                            </h4>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[issue.status] || 'bg-slate-100 text-slate-600'}`}>
                                                                {issue.status}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${PRIORITY_STYLES[issue.priority] || 'bg-slate-100 text-slate-600'}`}>
                                                                {issue.priority}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400">
                                                                by {issue.createdBy?.name || 'Citizen'} · {fmtDate(issue.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 line-clamp-2">
                                                            {issue.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {/* Check with AI button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => checkSingleIssueWithAi(issue)}
                                                            disabled={isChecking || scanning}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 transition disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {isChecking ? (
                                                                <>
                                                                    <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                                                    </svg>
                                                                    Checking AI...
                                                                </>
                                                            ) : (
                                                                <>✨ Check AI</>
                                                            )}
                                                        </button>

                                                        {/* Delete button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(issue._id)}
                                                            disabled={isDeleting}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition disabled:opacity-50 cursor-pointer"
                                                            title="Delete this complaint"
                                                        >
                                                            🗑 Delete
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* AI Results for this issue */}
                                                {aiData && (
                                                    <div className="mt-2 pl-3 border-l-2 border-indigo-400">
                                                        {aiData.error ? (
                                                            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                                                                ⚠️ {aiData.error}
                                                            </div>
                                                        ) : aiData.hasDuplicates && aiData.duplicates?.length > 0 ? (
                                                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">⚠️</span>
                                                                    <p className="text-xs font-bold text-amber-900">
                                                                        AI Confirmed {aiData.duplicates.length} duplicate issue(s) matching this complaint:
                                                                    </p>
                                                                </div>
                                                                {aiData.duplicates.map((dup, dupIdx) => {
                                                                    const sim = SIMILARITY_STYLES[dup.similarity] || SIMILARITY_STYLES.Medium;
                                                                    return (
                                                                        <div key={dup.issueId || dupIdx} className="bg-white rounded-lg p-2.5 border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                                    <p className="text-xs font-bold text-slate-800 truncate">{dup.title}</p>
                                                                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${sim.badge}`}>
                                                                                        <span className={`w-1 h-1 rounded-full ${sim.dot}`}></span>
                                                                                        {dup.similarity} Similarity
                                                                                    </span>
                                                                                    <span className="text-[10px] text-slate-400">📍 {dup.location}</span>
                                                                                </div>
                                                                                {dup.reason && (
                                                                                    <p className="text-[11px] text-slate-500 italic">💡 {dup.reason}</p>
                                                                                )}
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleDelete(dup.issueId)}
                                                                                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition cursor-pointer shrink-0"
                                                                            >
                                                                                Remove Duplicate
                                                                            </button>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : (
                                                            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-800 flex items-center gap-1.5">
                                                                <span>✓</span> AI checked: No other complaints in this category match the severity or problem description.
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Section 2: All Issues AI Verification Quick-Check */}
            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                            All Issues Quick AI Duplicate Checker
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Click &quot;Check AI&quot; on any individual complaint below to compare it against all other existing complaints.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-xs">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-3 py-2.5 text-left font-semibold">Title</th>
                                <th className="px-3 py-2.5 text-left font-semibold">Category</th>
                                <th className="px-3 py-2.5 text-left font-semibold">Location</th>
                                <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                                <th className="px-3 py-2.5 text-left font-semibold">AI Match Status</th>
                                <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {issues.slice(0, 15).map((iss) => {
                                const aiData = aiResults[iss._id];
                                const isChecking = checkingId === iss._id;

                                return (
                                    <Fragment key={iss._id}>
                                        <tr className="hover:bg-slate-50/50">
                                            <td className="px-3 py-2.5 font-medium text-slate-800 max-w-[180px] truncate">
                                                {iss.title}
                                            </td>
                                            <td className="px-3 py-2.5 text-slate-600">{iss.category}</td>
                                            <td className="px-3 py-2.5 text-slate-500 max-w-[140px] truncate">{iss.location}</td>
                                            <td className="px-3 py-2.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[iss.status] || 'bg-slate-100 text-slate-600'}`}>
                                                    {iss.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                {isChecking ? (
                                                    <span className="text-indigo-600 font-semibold animate-pulse">Checking...</span>
                                                ) : aiData?.hasDuplicates ? (
                                                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                                                        ⚠️ {aiData.duplicates.length} duplicate(s)
                                                    </span>
                                                ) : aiData ? (
                                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                                                        ✓ Unique
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">Not checked</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2.5 text-right space-x-1">
                                                <button
                                                    type="button"
                                                    onClick={() => checkSingleIssueWithAi(iss)}
                                                    disabled={isChecking || scanning}
                                                    className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold transition cursor-pointer"
                                                >
                                                    {isChecking ? '...' : '✨ Check'}
                                                </button>
                                            </td>
                                        </tr>
                                        {aiData?.hasDuplicates && aiData.duplicates?.length > 0 && (
                                            <tr className="bg-amber-50/50">
                                                <td colSpan={6} className="px-4 py-2.5">
                                                    <div className="space-y-1.5 border-l-2 border-amber-400 pl-3">
                                                        <p className="text-[11px] font-bold text-amber-900">
                                                            Matching Complaints Found:
                                                        </p>
                                                        {aiData.duplicates.map((dup, dIdx) => (
                                                            <div key={dIdx} className="flex items-center justify-between gap-2 text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-amber-200 shadow-2xs">
                                                                <div>
                                                                    <span className="font-semibold text-slate-900">{dup.title}</span>
                                                                    <span className="text-slate-500 ml-2">📍 {dup.location}</span>
                                                                    <span className="text-amber-700 font-bold ml-2">[{dup.similarity} Match]</span>
                                                                    {dup.reason && <p className="text-[10px] text-slate-500 italic mt-0.5">{dup.reason}</p>}
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(dup.issueId)}
                                                                    className="px-2.5 py-1 bg-rose-600 text-white font-semibold rounded-md text-[10px] hover:bg-rose-700 cursor-pointer"
                                                                >
                                                                    Delete Duplicate
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
