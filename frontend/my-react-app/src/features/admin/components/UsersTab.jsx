import Spinner from "./Spinner";
import ErrorBanner from "./ErrorBanner";
import { RoleBadge } from "./AdminBadges";

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function UsersTab({ users, loading, error }) {
    return (
        <div className="space-y-4">
            <ErrorBanner message={error} />
            {loading ? (
                <Spinner />
            ) : users.length === 0 ? (
                <p className="py-12 text-center text-sm text-slate-400">No users found.</p>
            ) : (
                <>
                    {/* Mobile Card View (< sm) */}
                    <div className="block sm:hidden space-y-3">
                        {users.map((u) => (
                            <div
                                key={u._id}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {u.avatar ? (
                                            <img
                                                src={u.avatar}
                                                alt=""
                                                className="h-9 w-9 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 shrink-0">
                                                {u.name?.[0]?.toUpperCase() ?? "?"}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {u.name}
                                            </p>
                                            <a
                                                href={`mailto:${u.email}`}
                                                className="text-xs text-indigo-600 hover:underline break-all block"
                                            >
                                                {u.email}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="shrink-0">
                                        <RoleBadge role={u.role} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                                    <span>Registered Account</span>
                                    <span className="font-medium text-slate-700 whitespace-nowrap">
                                        Joined {fmtDate(u.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop & Tablet Table View (>= sm) */}
                    <div className="hidden sm:block overflow-x-auto rounded-xl bg-white shadow-sm border border-slate-100">
                        <table className="min-w-[550px] w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-slate-600 whitespace-nowrap">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((u, idx) => (
                                    <tr
                                        key={u._id}
                                        className={idx % 2 === 1 ? "bg-slate-50/50" : ""}
                                    >
                                        <td className="px-4 py-3 font-medium text-slate-800">
                                            <div className="flex items-center gap-3">
                                                {u.avatar ? (
                                                    <img
                                                        src={u.avatar}
                                                        alt=""
                                                        className="h-7 w-7 rounded-full object-cover shrink-0"
                                                    />
                                                ) : (
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 shrink-0">
                                                        {u.name?.[0]?.toUpperCase() ?? "?"}
                                                    </div>
                                                )}
                                                <span className="truncate max-w-[180px]">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            <a
                                                href={`mailto:${u.email}`}
                                                className="hover:text-indigo-600 hover:underline"
                                            >
                                                {u.email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <RoleBadge role={u.role} />
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                            {fmtDate(u.createdAt)}
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
