export default function AdminSidebar({
    activeTab,
    onTabChange,
    user,
    onLogout,
    mobileOpen,
    onMobileClose,
}) {
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
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-900/30 hover:text-rose-300 cursor-pointer"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

