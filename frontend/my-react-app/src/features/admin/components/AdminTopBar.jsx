import { Link } from 'react-router';
import NotificationDropdown from '../../notifications/components/NotificationDropdown';

export default function AdminTopBar({ activeTab, onOpenSidebar, user, onTabChange }) {
    // Prevent duplicate "Admin Admin" appearance
    const rawName = user?.name?.trim() || '';
    const isGenericAdminName = !rawName || rawName.toLowerCase() === 'admin';
    const displayName = isGenericAdminName ? 'Admin Workspace' : rawName;
    const initial = isGenericAdminName ? 'A' : rawName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-md shadow-xs sm:px-6">
            {/* Left section: Mobile menu + Page breadcrumb */}
            <div className="flex items-center gap-3">
                {/* Mobile hamburger button */}
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden cursor-pointer"
                    onClick={onOpenSidebar}
                    aria-label="Open sidebar"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Page Title & Breadcrumb */}
                <div className="flex items-center gap-2">
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Admin Console
                        <span className="text-slate-300">/</span>
                    </span>
                    <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {activeTab}
                    </h1>

                    {/* Live System Indicator */}
                    <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 ml-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live System
                    </span>
                </div>
            </div>

            {/* Right section: Quick actions + Notifications + Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Switch to Citizen Portal */}
                <Link
                    to="/"
                    title="View citizen public site"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition"
                >
                    <svg className="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Citizen Portal</span>
                </Link>

                {/* Live Notification Dropdown */}
                <NotificationDropdown
                    onSelectIssue={() => {
                        if (typeof onTabChange === 'function') {
                            onTabChange('Issues');
                        }
                    }}
                />

                {/* Profile Pill */}
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-1 sm:pr-3 pl-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-indigo-800 text-xs font-bold text-white shadow-xs">
                        {initial}
                    </div>

                    <div className="hidden sm:block text-left leading-none">
                        <p className="text-xs font-bold text-slate-900 max-w-[120px] truncate">
                            {displayName}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                            Super Administrator
                        </p>
                    </div>

                    <span className="hidden md:inline-flex items-center gap-1 rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                        </svg>
                        Staff
                    </span>
                </div>
            </div>
        </header>
    );
}
