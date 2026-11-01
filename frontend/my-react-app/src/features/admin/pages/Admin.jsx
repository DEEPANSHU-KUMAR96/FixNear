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
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";
import DashboardTab from "../components/DashboardTab";
import IssuesTab from "../components/IssuesTab";
import UsersTab from "../components/UsersTab";
import InquiriesTab from "../components/InquiriesTab";

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

        getAdminStats()
            .then((s) => { if (alive) setStats(s); })
            .catch((e) => { if (alive) setStatsError(e.message); })
            .finally(() => { if (alive) setStatsLoading(false); });

        getAdminAllIssues()
            .then((data) => { if (alive) setIssues(data); })
            .catch((e) => { if (alive) setIssuesError(e.message); })
            .finally(() => { if (alive) setIssuesLoading(false); });

        getAdminUsers()
            .then((data) => { if (alive) setUsers(data); })
            .catch((e) => { if (alive) setUsersError(e.message); })
            .finally(() => { if (alive) setUsersLoading(false); });

        getAdminInquiries()
            .then((data) => { if (alive) setInquiries(data); })
            .catch((e) => { if (alive) setInquiriesError(e.message); })
            .finally(() => { if (alive) setInquiriesLoading(false); });

        return () => { alive = false; };
    }, [isAuthenticated, user?.role]);

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

    return (
        <div className="flex min-h-screen bg-slate-100">
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                user={user}
                onLogout={handleLogout}
                mobileOpen={sidebarOpen}
                onMobileClose={() => setSidebarOpen(false)}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <AdminTopBar
                    activeTab={activeTab}
                    onOpenSidebar={() => setSidebarOpen(true)}
                    user={user}
                />

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
