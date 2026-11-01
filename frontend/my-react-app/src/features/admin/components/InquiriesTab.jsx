import Spinner from "./Spinner";
import ErrorBanner from "./ErrorBanner";
import { InquiryStatusBadge } from "./AdminBadges";

const INQUIRY_STATUSES = ["Pending", "Reviewed", "Responded"];

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function InquiriesTab({
    inquiries,
    loading,
    error,
    onStatusChange,
    onDelete,
    updatingId,
}) {
    return (
        <div className="space-y-4">
            <ErrorBanner message={error} />
            {loading ? (
                <Spinner />
            ) : inquiries.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">
                    No inquiries yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {inquiries.map((inquiry) => (
                        <li
                            key={inquiry._id}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <h2 className="font-semibold text-slate-900">
                                            {inquiry.name}
                                        </h2>
                                        <a
                                            href={`mailto:${inquiry.email}`}
                                            className="break-all text-sm text-emerald-600 hover:underline"
                                        >
                                            {inquiry.email}
                                        </a>
                                        <InquiryStatusBadge status={inquiry.status} />
                                    </div>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {fmtDate(inquiry.createdAt)}
                                    </p>
                                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                        {inquiry.message}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                    <label
                                        className="sr-only"
                                        htmlFor={`inq-status-${inquiry._id}`}
                                    >
                                        Inquiry status
                                    </label>
                                    <select
                                        id={`inq-status-${inquiry._id}`}
                                        value={inquiry.status}
                                        disabled={updatingId === inquiry._id}
                                        onChange={(e) =>
                                            onStatusChange(inquiry._id, e.target.value)
                                        }
                                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-50"
                                    >
                                        {INQUIRY_STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        disabled={updatingId === inquiry._id}
                                        onClick={() => onDelete(inquiry._id)}
                                        className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
