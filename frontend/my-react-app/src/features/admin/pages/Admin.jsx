import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../auth/hooks/useAuth";
import {
    deleteAdminInquiry,
    deleteAdminIssue,
    getAdminAllIssues,
    getAdminInquiries,
    getAdminStats,
    getAdminUsers,
    updateAdminInquiryStatus,
    updateAdminIssueStatus,
} from "../services/admin.service";

// ── Constants ──────────────────────────────────────────────────────────────────

const INQUIRY_STATUSES = ["Pending", "Reviewed", "Responded"];
const ISSUE_STATUSES = ["Reported", "In Progress", "Resolved"];

// ── Tiny helpers ───────────────────────────────────────────────────────────────

function fmtDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// ── Badge components ───────────────────────────────────────────────────────────

function IssueStatusBadge({ status }) {
    const cls =
        status === "Resolved"
            ? "bg-emerald-100 text-emerald-700"
            : status === "In Progress"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            {status}
        </span>
    );
}

function InquiryStatusBadge({ status }) {
    const cls =
        status === "Responded"
            ? "bg-emerald-100 text-emerald-700"
            : status === "Reviewed"
            ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            {status}
        </span>
    );
}

function RoleBadge({ role }) {
    const cls =
        role === "admin"
            ? "bg-purple-100 text-purple-700"
            : "bg-blue-100 text-blue-700";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
            {role}
        </span>
    );
}

// ── Spinner ────────────────────────────────────────────────────────────────────

function Spinner() {
    return (
        <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500" />
        </div>
    );
}

// ── Error banner ───────────────────────────────────────────────────────────────

function ErrorBanner({ message, onDismiss }) {
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

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, borderColor, icon }) {
    return (
        <div className={`rounded-xl border-t-4 bg-white p-5 shadow-sm ${borderColor}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-800">
                {value ?? <span className="text-slate-300">—</span>}
            </p>
        </div>
    );
}

// ── Dashboard tab ──────────────────────────────────────────────────────────────

function DashboardTab({ stats, issues, statsLoading, issuesLoading, statsError, issuesError }) {
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
                <h2 className="mb-3 text-base font-semibold text-slate-700">
                    Recent Issues
                </h2>
                {issuesLoading ? (
                    <Spinner />
                ) : issues.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-400">
                        No issues reported yet.
                    </p>
                ) : (
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
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
                                        <td className="px-4 py-3 text-slate-500">
                                            {fmtDate(issue.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Issues tab ─────────────────────────────────────────────────────────────────

function IssuesTab({ issues, loading, error, onStatusChange, onDelete, updatingId }) {
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

// ── Users tab ──────────────────────────────────────────────────────────────────

function UsersTab({ users, loading, error }) {
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

// ── Inquiries tab ──────────────────────────────────────────────────────────────

function InquiriesTab({
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

// ── Sidebar ────────────────────────────────────────────────────────────────────

function Sidebar({ activeTab, onTabChange, user, onLogout, mobileOpen, onMobileClose }) {
    const navItems = [
        { tab: "Dashboard", icon: "🏠" },
        { tab: "Issues", icon: "📋" },
        { tab: "Users", icon: "👥" },
        { tab: "Inquiries", icon: "✉️" },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={onMobileClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo area */}
                <div className="flex items-center gap-3 border-b border-slate-700 px-6 py-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-lg font-bold">
                        F
                    </div>
                    <div>
                        <p className="text-sm font-bold tracking-wide">FixNear</p>
                        <span className="inline-block rounded border border-emerald-500/30 bg-emerald-500/20 px-2 py-px text-[10px] font-semibold text-emerald-400">
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Admin info */}
                <div className="border-b border-slate-700 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-slate-200">
                            {user?.name?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{user?.name}</p>
                            <p className="truncate text-xs text-slate-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map(({ tab, icon }) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => {
                                onTabChange(tab);
                                onMobileClose();
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? "bg-slate-700 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            <span>{icon}</span>
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Bottom: back + logout */}
                <div className="space-y-2 border-t border-slate-700 px-3 py-4">
                    <a
                        href="/"
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                        <span>←</span> Back to FixNear
                    </a>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-900/30 hover:text-rose-300"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

// ── Main Admin component ───────────────────────────────────────────────────────

const Admin = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Stats
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState("");

    // Issues
    const [issues, setIssues] = useState([]);
    const [issuesLoading, setIssuesLoading] = useState(true);
    const [issuesError, setIssuesError] = useState("");
    const [issueUpdatingId, setIssueUpdatingId] = useState("");

    // Users
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState("");

    // Inquiries
    const [inquiries, setInquiries] = useState([]);
    const [inquiriesLoading, setInquiriesLoading] = useState(true);
    const [inquiriesError, setInquiriesError] = useState("");
    const [inqUpdatingId, setInqUpdatingId] = useState("");

    // Auth guard
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Fetch all admin data (only if admin)
    useEffect(() => {
        if (!isAuthenticated || user?.role !== "admin") return;

        let alive = true;

        // Stats
        getAdminStats()
            .then((s) => { if (alive) setStats(s); })
            .catch((e) => { if (alive) setStatsError(e.message); })
            .finally(() => { if (alive) setStatsLoading(false); });

        // Issues
        getAdminAllIssues()
            .then((data) => { if (alive) setIssues(data); })
            .catch((e) => { if (alive) setIssuesError(e.message); })
            .finally(() => { if (alive) setIssuesLoading(false); });

        // Users
        getAdminUsers()
            .then((data) => { if (alive) setUsers(data); })
            .catch((e) => { if (alive) setUsersError(e.message); })
            .finally(() => { if (alive) setUsersLoading(false); });

        // Inquiries
        getAdminInquiries()
            .then((data) => { if (alive) setInquiries(data); })
            .catch((e) => { if (alive) setInquiriesError(e.message); })
            .finally(() => { if (alive) setInquiriesLoading(false); });

        return () => { alive = false; };
    }, [isAuthenticated, user?.role]);

    // ── Handlers ────────────────────────────────────────────────────────────────

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login", { replace: true });
        } catch {
            navigate("/login", { replace: true });
        }
    };

    const handleIssueStatusChange = async (id, status) => {
        setIssueUpdatingId(id);
        setIssuesError("");
        try {
            const updated = await updateAdminIssueStatus(id, status);
            setIssues((prev) =>
                prev.map((iss) => (iss._id === id ? updated : iss))
            );
        } catch (e) {
            setIssuesError(e.message);
        } finally {
            setIssueUpdatingId("");
        }
    };

    const handleIssueDelete = async (id) => {
        if (!window.confirm("Delete this issue permanently? This cannot be undone."))
            return;
        setIssueUpdatingId(id);
        setIssuesError("");
        try {
            await deleteAdminIssue(id);
            setIssues((prev) => prev.filter((iss) => iss._id !== id));
        } catch (e) {
            setIssuesError(e.message);
        } finally {
            setIssueUpdatingId("");
        }
    };

    const handleInquiryStatusChange = async (id, status) => {
        setInqUpdatingId(id);
        setInquiriesError("");
        try {
            const updated = await updateAdminInquiryStatus(id, status);
            setInquiries((prev) =>
                prev.map((inq) => (inq._id === id ? updated : inq))
            );
        } catch (e) {
            setInquiriesError(e.message);
        } finally {
            setInqUpdatingId("");
        }
    };

    const handleInquiryDelete = async (id) => {
        if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
        setInqUpdatingId(id);
        setInquiriesError("");
        try {
            await deleteAdminInquiry(id);
            setInquiries((prev) => prev.filter((inq) => inq._id !== id));
        } catch (e) {
            setInquiriesError(e.message);
        } finally {
            setInqUpdatingId("");
        }
    };

    // ── Render guards ────────────────────────────────────────────────────────────

    if (!isAuthenticated) return null;

    if (user?.role !== "admin") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="max-w-sm rounded-2xl border border-rose-200 bg-white p-8 text-center shadow">
                    <p className="text-4xl">🚫</p>
                    <h1 className="mt-4 text-xl font-bold text-slate-900">Access Denied</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        You don&apos;t have admin privileges.
                    </p>
                    <a
                        href="/"
                        className="mt-6 inline-block rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    // ── Layout ───────────────────────────────────────────────────────────────────

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                user={user}
                onLogout={handleLogout}
                mobileOpen={sidebarOpen}
                onMobileClose={() => setSidebarOpen(false)}
            />

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
                    {/* Hamburger (mobile) */}
                    <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <span className="block h-0.5 w-5 bg-current mb-1" />
                        <span className="block h-0.5 w-5 bg-current mb-1" />
                        <span className="block h-0.5 w-5 bg-current" />
                    </button>

                    <h1 className="flex-1 text-lg font-bold text-slate-800">
                        {activeTab}
                    </h1>

                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                            {user?.name?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <span className="hidden text-sm font-medium text-slate-700 sm:block">
                            {user?.name}
                        </span>
                        <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                            Admin
                        </span>
                    </div>
                </header>

                {/* Page body */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {activeTab === "Dashboard" && (
                        <DashboardTab
                            stats={stats}
                            issues={issues}
                            statsLoading={statsLoading}
                            issuesLoading={issuesLoading}
                            statsError={statsError}
                            issuesError={issuesError}
                        />
                    )}
                    {activeTab === "Issues" && (
                        <IssuesTab
                            issues={issues}
                            loading={issuesLoading}
                            error={issuesError}
                            onStatusChange={handleIssueStatusChange}
                            onDelete={handleIssueDelete}
                            updatingId={issueUpdatingId}
                        />
                    )}
                    {activeTab === "Users" && (
                        <UsersTab
                            users={users}
                            loading={usersLoading}
                            error={usersError}
                        />
                    )}
                    {activeTab === "Inquiries" && (
                        <InquiriesTab
                            inquiries={inquiries}
                            loading={inquiriesLoading}
                            error={inquiriesError}
                            onStatusChange={handleInquiryStatusChange}
                            onDelete={handleInquiryDelete}
                            updatingId={inqUpdatingId}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Admin;
