import { useState } from 'react';
import { Link } from 'react-router';

export default function DashboardTopBar({ user, onOpenSidebar, unreadCount = 0, recentIssues = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Citizen');
  const displayRole = user?.role || 'Citizen';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
      {/* Mobile hamburger button */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl cursor-pointer"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-slate-800 text-lg">FixNear</span>
      </div>

      {/* Desktop navigation link */}
      <div className="hidden lg:flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg border border-slate-200 transition"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Right controls: Notifications + Profile */}
      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        {/* Notification Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition relative cursor-pointer"
            aria-label="View notifications"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Notifications</span>
                <span
                  className="text-[11px] text-blue-600 font-semibold cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {recentIssues.length > 0 ? (
                  recentIssues.map((issue) => (
                    <div key={issue._id} className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100/60">
                      <p className="font-semibold text-slate-900 truncate">{issue.title}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Status is currently marked as <span className="font-semibold text-blue-600">{issue.status}</span>.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-slate-500">
                    <p className="font-medium text-slate-700">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No new notifications at this time.</p>
                  </div>
                )}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">FixNear Civic Portal</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Report civic issues and monitor municipal resolution status.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
              {displayName.charAt(0)}
            </div>
          )}

          <div className="text-left leading-tight hidden sm:block">
            <h4 className="text-sm font-bold text-slate-900 capitalize">
              {displayName}
            </h4>
            <p className="text-xs text-slate-400 font-medium capitalize">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
