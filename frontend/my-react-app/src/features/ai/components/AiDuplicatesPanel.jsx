const SIMILARITY_STYLES = {
    High: { badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    Medium: { badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    Low: { badge: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const STATUS_STYLES = {
    Reported: 'bg-orange-100 text-orange-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
};

/**
 * Shows a warning panel with potential duplicate issues.
 * Props:
 *   result: { hasDuplicates: boolean, duplicates: Array }
 *   onDismiss: () => void
 *   onProceedAnyway: () => void   — optional, called when user confirms they want to proceed
 */
export default function AiDuplicatesPanel({ result, onDismiss, onProceedAnyway }) {
    if (!result) return null;

    // No duplicates — show a clean "all clear" badge
    if (!result.hasDuplicates || result.duplicates.length === 0) {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 flex items-start gap-3">
                <span className="text-lg mt-0.5">✅</span>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-800">No Duplicates Found</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Your issue appears to be unique. Feel free to submit.</p>
                </div>
                {onDismiss && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="text-emerald-400 hover:text-emerald-700 text-xs font-bold cursor-pointer transition shrink-0"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                )}
            </div>
        );
    }

    // Duplicates found
    return (
        <div className="rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200 bg-amber-100/60">
                <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <div>
                        <p className="text-sm font-bold text-amber-900">Similar Issues Already Reported</p>
                        <p className="text-[11px] text-amber-700 mt-0.5">
                            {result.duplicates.length} potential duplicate{result.duplicates.length > 1 ? 's' : ''} found — please review before submitting
                        </p>
                    </div>
                </div>
                {onDismiss && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="text-amber-500 hover:text-amber-800 text-xs font-bold cursor-pointer transition shrink-0"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Duplicate cards */}
            <div className="p-3 space-y-2.5">
                {result.duplicates.map((dup, i) => {
                    const sim = SIMILARITY_STYLES[dup.similarity] || SIMILARITY_STYLES.Low;
                    const statusStyle = STATUS_STYLES[dup.status] || 'bg-slate-100 text-slate-600';

                    return (
                        <div
                            key={dup.issueId || i}
                            className="bg-white rounded-lg border border-amber-100 p-3 space-y-2 shadow-xs"
                        >
                            {/* Top row */}
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-800 leading-snug">
                                    {dup.title}
                                </p>
                                <span className={`inline-flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${sim.badge}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${sim.dot}`}></span>
                                    {dup.similarity} Match
                                </span>
                            </div>

                            {/* Location + Status */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                    📍 {dup.location}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusStyle}`}>
                                    {dup.status}
                                </span>
                            </div>

                            {/* AI Reason */}
                            {dup.reason && (
                                <p className="text-[11px] text-slate-500 italic leading-relaxed border-t border-slate-100 pt-2">
                                    💡 {dup.reason}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer actions */}
            {onProceedAnyway && (
                <div className="px-3 pb-3">
                    <button
                        type="button"
                        onClick={onProceedAnyway}
                        className="w-full py-2 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-200 rounded-lg transition cursor-pointer"
                    >
                        My issue is different — Proceed anyway
                    </button>
                </div>
            )}
        </div>
    );
}
