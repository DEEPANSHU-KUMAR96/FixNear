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
                <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-600">
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
                                                    className="h-7 w-7 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                                                    {u.name?.[0]?.toUpperCase() ?? "?"}
                                                </div>
                                            )}
                                            {u.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <RoleBadge role={u.role} />
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {fmtDate(u.createdAt)}
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
