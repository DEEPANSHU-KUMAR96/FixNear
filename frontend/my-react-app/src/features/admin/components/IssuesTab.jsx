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

export default function IssuesTab({ issues, loading, error, onStatusChange, onDelete, updatingId }) {
    return (
        <div className="space-y-4">
            <ErrorBanner message={error} />
            {loading ? (
                <Spinner />
            ) : issues.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">No issues found.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
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
                                    <td className="max-w-[160px] truncate px-4 py-3 font-medium text-slate-800">
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
                                    <td className="px-4 py-3 text-slate-500">
                                        {fmtDate(issue.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            type="button"
                                            disabled={updatingId === issue._id}
                                            onClick={() => onDelete(issue._id)}
                                            className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
