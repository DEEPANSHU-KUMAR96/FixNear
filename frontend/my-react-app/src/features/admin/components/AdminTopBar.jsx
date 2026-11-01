export default function AdminTopBar({ activeTab, onOpenSidebar, user }) {
    return (
        <header className="flex items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            {/* Hamburger (mobile) */}
            <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
                onClick={onOpenSidebar}
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
    );
}

