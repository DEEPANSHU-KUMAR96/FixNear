export default function ErrorBanner({ message, onDismiss }) {
    if (!message) return null;
    return (
        <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
        >
            <span className="flex-1">{message}</span>
            {onDismiss && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 font-bold leading-none hover:opacity-70"
                    aria-label="Dismiss error"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
