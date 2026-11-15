import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../notifications/services/notification.service';

function formatTime(dateStr) {
  if (!dateStr) return 'Recent';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DashboardTopBar({ user, onOpenSidebar, recentIssues = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Citizen');
  const displayRole = user?.role || 'Citizen';

  // Load real notifications from backend
  useEffect(() => {
    let isMounted = true;

    fetchNotifications()
      .then((res) => {
        if (!isMounted) return;
        if (res?.success && Array.isArray(res.notifications)) {
          setNotifications(res.notifications);
          setUnreadCount(
            typeof res.unreadCount === 'number'
              ? res.unreadCount
              : res.notifications.filter((n) => !n.read).length
          );
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (Array.isArray(recentIssues) && recentIssues.length > 0) {
          const derived = recentIssues.map((issue) => ({
            _id: issue._id,
            title: issue.status && issue.status !== 'Reported' ? 'Status Updated' : 'Issue Reported',
            message: issue.status && issue.status !== 'Reported'
              ? `Your complaint "${issue.title}" is currently "${issue.status}".`
              : `Your complaint "${issue.title}" was registered in your area.`,
            type: issue.status && issue.status !== 'Reported' ? 'status_change' : 'issue_created',
            read: issue.status === 'Reported',
            createdAt: issue.updatedAt || issue.createdAt || new Date().toISOString(),
          }));
          setNotifications(derived);
          setUnreadCount(derived.filter((n) => !n.read).length);
        } else {
          setNotifications([]);
          setUnreadCount(0);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?._id, user?.id, recentIssues]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
    } catch {
      // Optimistic local update
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        if (notif._id && !notif._id.startsWith('local-')) {
          await markNotificationAsRead(notif._id);
        }
      } catch {
        // Optimistic local update
      }
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

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
        <div className="relative" ref={dropdownRef}>
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
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Notification Items List */}
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {isLoading ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading updates...
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => {
                    const isUnread = !notif.read;
                    return (
                      <div
                        key={notif._id || notif.createdAt}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 rounded-xl border transition cursor-pointer relative ${
                          isUnread
                            ? 'bg-blue-50/70 border-blue-100/80 hover:bg-blue-50'
                            : 'bg-slate-50/70 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {isUnread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                            )}
                            <p className="font-bold text-slate-900 text-xs truncate">
                              {notif.title}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs mt-1 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-400">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-base">
                      🔔
                    </div>
                    <p className="font-semibold text-slate-700 text-xs">No notifications yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 max-w-[220px] mx-auto">
                      Real-time updates regarding your reported civic issues will appear here.
                    </p>
                  </div>
                )}
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
