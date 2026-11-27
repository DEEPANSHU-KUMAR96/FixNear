import Spinner from "./Spinner";
import ErrorBanner from "./ErrorBanner";

const ISSUE_STATUSES = ["Reported", "In Progress", "Resolved"];

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function IssuesTab({ issues, loading, error, onStatusChange, onDelete, updatingId, onOpenMap }) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                    Total <span className="font-semibold text-slate-700">{issues?.length ?? 0}</span> citizen complaints logged in system.
                </p>
                {typeof onOpenMap === "function" && (
                    <button
                        type="button"
                        onClick={onOpenMap}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 transition cursor-pointer shrink-0"
                    >
                        <span>🗺️</span>
                        <span>Open Live Map</span>
                    </button>
                )}
            </div>
            <ErrorBanner message={error} />
            {loading ? (
                <Spinner />
            ) : issues.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">No issues found.</p>
            ) : (
                <>
                    {/* Mobile Card View (< md) */}
                    <div className="block md:hidden space-y-3">
                        {issues.map((issue) => (
                            <div
                                key={issue._id}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-semibold text-slate-900 leading-snug break-words flex-1">
                                        {issue.title}
                                    </h3>
                                    <button
                                        type="button"
                                        disabled={updatingId === issue._id}
                                        onClick={() => onDelete(issue._id)}
                                        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 shrink-0 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                        📁 {issue.category}
                                    </span>
                                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 border border-indigo-100">
                                        ⚡ {issue.priority || "Normal"}
                                    </span>
                                    <span className="text-slate-400 text-[11px] ml-auto">
                                        📅 {fmtDate(issue.createdAt)}
                                    </span>
                                </div>

                                {issue.location && (
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span>📍</span>
                                        <span className="truncate">{issue.location}</span>
                                    </p>
                                )}

                                <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                                    <span className="text-[11px] text-slate-500 truncate">
                                        By: <span className="font-medium text-slate-700">{issue.createdBy?.name ?? "Citizen"}</span>
                                    </span>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <label
                                            className="text-[11px] font-medium text-slate-500"
                                            htmlFor={`m-issue-status-${issue._id}`}
                                        >
                                            Status:
                                        </label>
                                        <select
                                            id={`m-issue-status-${issue._id}`}
                                            value={issue.status}
                                            disabled={updatingId === issue._id}
                                            onChange={(e) =>
                                                onStatusChange(issue._id, e.target.value)
                                            }
                                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 disabled:opacity-50"
                                        >
                                            {ISSUE_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop & Tablet Table View (>= md) */}
                    <div className="hidden md:block overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
                        <table className="min-w-[760px] w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Priority
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Reporter
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {issues.map((issue, idx) => (
                                    <tr
                                        key={issue._id}
                                        className={idx % 2 === 1 ? "bg-slate-50/50" : ""}
                                    >
                                        <td className="max-w-[200px] truncate px-4 py-3 font-medium text-slate-800">
                                            {issue.title}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{issue.category}</td>
                                        <td className="px-4 py-3">
                                            <label
                                                className="sr-only"
                                                htmlFor={`issue-status-${issue._id}`}
                                            >
                                                Issue status
                                            </label>
                                            <select
                                                id={`issue-status-${issue._id}`}
                                                value={issue.status}
                                                disabled={updatingId === issue._id}
                                                onChange={(e) =>
                                                    onStatusChange(issue._id, e.target.value)
                                                }
                                                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs disabled:opacity-50"
                                            >
                                                {ISSUE_STATUSES.map((s) => (
                                                    <option key={s} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{issue.priority}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {issue.createdBy?.name ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                            {fmtDate(issue.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                disabled={updatingId === issue._id}
                                                onClick={() => onDelete(issue._id)}
                                                className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
