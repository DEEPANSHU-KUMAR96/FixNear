import Spinner from "./Spinner";
import ErrorBanner from "./ErrorBanner";
import StatCard from "./StatCard";
import { IssueStatusBadge } from "./AdminBadges";

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function DashboardTab({ stats, issues, statsLoading, issuesLoading, statsError, issuesError, onOpenMap }) {
    return (
        <div className="space-y-8">
            <ErrorBanner message={statsError} />
            <ErrorBanner message={issuesError} />

            {/* Stat cards */}
            {statsLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        label="Total Issues"
                        value={stats?.totalIssues}
                        borderColor="border-t-blue-500"
                        icon="📋"
                    />
                    <StatCard
                        label="Total Users"
                        value={stats?.totalUsers}
                        borderColor="border-t-purple-500"
                        icon="👥"
                    />
                    <StatCard
                        label="Pending Inquiries"
                        value={stats?.pendingInquiries}
                        borderColor="border-t-amber-500"
                        icon="✉️"
                    />
                    <StatCard
                        label="Resolved Issues"
                        value={stats?.resolvedIssues}
                        borderColor="border-t-emerald-500"
                        icon="✅"
                    />
                </div>
            )}

            {/* Recent issues */}
            <div>
                <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <h2 className="text-base font-semibold text-slate-700">
                        Recent Issues
                    </h2>
                    {typeof onOpenMap === "function" && (
                        <button
                            type="button"
                            onClick={onOpenMap}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700 transition cursor-pointer shrink-0"
                        >
                            <span>🗺️</span>
                            <span>Open Operations Map</span>
                        </button>
                    )}
                </div>
                {issuesLoading ? (
                    <Spinner />
                ) : issues.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                        No issues reported yet.
                    </p>
                ) : (
                    <>
                        {/* Mobile Card List (< sm) */}
                        <div className="block sm:hidden space-y-2.5">
                            {issues.slice(0, 5).map((issue) => (
                                <div
                                    key={issue._id}
                                    className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-xs font-semibold text-slate-900 break-words flex-1">
                                            {issue.title}
                                        </p>
                                        <IssueStatusBadge status={issue.status} />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                                        <span className="font-medium text-slate-600">📁 {issue.category}</span>
                                        <span>📅 {fmtDate(issue.createdAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop & Tablet Table View (>= sm) */}
                        <div className="hidden sm:block overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
                            <table className="min-w-[500px] w-full divide-y divide-slate-100 text-sm">
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
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {issues.slice(0, 5).map((issue, idx) => (
                                        <tr
                                            key={issue._id}
                                            className={idx % 2 === 1 ? "bg-slate-50/50" : ""}
                                        >
                                            <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-800">
                                                {issue.title}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {issue.category}
                                            </td>
                                            <td className="px-4 py-3">
                                                <IssueStatusBadge status={issue.status} />
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                                {fmtDate(issue.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
