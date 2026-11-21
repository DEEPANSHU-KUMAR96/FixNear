const PRIORITY_STYLES = {
    High: 'bg-red-50 border-red-200 text-red-700',
    Medium: 'bg-amber-50 border-amber-200 text-amber-700',
    Low: 'bg-emerald-50 border-emerald-200 text-emerald-700',
};

const PRIORITY_DOT = {
    High: 'bg-red-500',
    Medium: 'bg-amber-500',
    Low: 'bg-emerald-500',
};

/**
 * Displays the AI classification result — category, priority, summary and reason.
 * Props:
 *   result: { category, priority, summary, reason }
 *   onDismiss: () => void
 */
export default function AiSuggestionBadge({ result, onDismiss }) {
    if (!result) return null;

    const priorityStyle = PRIORITY_STYLES[result.priority] || 'bg-slate-50 border-slate-200 text-slate-700';
    const dotStyle = PRIORITY_DOT[result.priority] || 'bg-slate-400';

    return (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3.5 space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className="text-base">✨</span>
                    <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
                        AI Suggestion Applied
                    </span>
                </div>
                {onDismiss && (
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="text-violet-400 hover:text-violet-700 text-xs font-bold cursor-pointer transition"
                        aria-label="Dismiss AI suggestion"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Category + Priority badges */}
            <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 text-violet-800 text-[11px] font-semibold border border-violet-200">
                    📂 {result.category}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${priorityStyle}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`}></span>
                    {result.priority} Priority
                </span>
            </div>

            {/* Summary */}
            {result.summary && (
                <p className="text-xs text-violet-800 leading-relaxed">
                    <span className="font-semibold">Summary: </span>
                    {result.summary}
                </p>
            )}

            {/* Reason */}
            {result.reason && (
                <p className="text-[11px] text-violet-600 italic leading-relaxed border-t border-violet-100 pt-2">
                    💡 {result.reason}
                </p>
            )}
        </div>
    );
}
