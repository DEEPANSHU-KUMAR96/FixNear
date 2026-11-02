import { useState } from 'react';

export default function DashboardTopBar({ user, onOpenSidebar, unreadCount = 2 }) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
      {/* Mobile hamburger button */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="font-bold text-slate-800 text-lg">FixNear</span>
      </div>

      <div className="hidden lg:block">
        {/* Can be empty or show breadcrumb */}
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
                <span className="text-[11px] text-blue-600 font-semibold cursor-pointer" onClick={() => setShowNotifications(false)}>Close</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100/60">
                  <p className="font-semibold text-slate-900">Issue Status Updated</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Your reported water leakage is now marked &quot;In Progress&quot;.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1 hour ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-semibold text-slate-900">Welcome to FixNear</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">Start tracking civic issues in your neighborhood.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
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
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <div className="text-left leading-tight">
            <h4 className="text-sm font-bold text-slate-900 capitalize">
              {user?.name || 'Deepanshu'}
            </h4>
            <p className="text-xs text-slate-400 font-medium capitalize">
              {user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

