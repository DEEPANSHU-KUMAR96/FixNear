import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';

function formatRelativeTime(dateStr) {
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

function getTypeIcon(type) {
    switch (type) {
        case 'issue_created':
            return (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                </div>
            );
        case 'status_change':
            return (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            );
        case 'general':
            return (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
            );
    }
}

export default function NotificationDropdown({ onSelectIssue }) {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'
    const containerRef = useRef(null);

    const {
        notifications,
        unreadCount,
        loading,
        refresh,
        markAllRead,
        markSingleRead,
        removeNotification,
    } = useNotifications({ pollInterval: 25000 });

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        function handleKeyDown(e) {
            if (e.key === 'Escape') setOpen(false);
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    const displayedNotifications = notifications.filter((item) => {
        if (filter === 'unread') return !item.read;
        return true;
    });

    const handleItemClick = (item) => {
        if (!item.read) {
            markSingleRead(item._id);
        }
        if (item.issueId && typeof onSelectIssue === 'function') {
            onSelectIssue(item.issueId);
            setOpen(false);
        }
    };

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
                    open
                        ? 'border-indigo-300 bg-indigo-50/70 text-indigo-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                }`}
                aria-label="View notifications"
                aria-expanded={open}
            >
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Floating Panel */}
            {open && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xl ring-1 ring-black/5 z-50">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">Notifications</span>
                            {unreadCount > 0 ? (
                                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                                    {unreadCount} unread
                                </span>
                            ) : (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                    All read
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => refresh()}
                                title="Refresh"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
                            >
                                <svg
                                    className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={markAllRead}
                                    className="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1 pt-2 pb-2 px-1">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                                filter === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('unread')}
                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                                filter === 'unread'
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                            }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto space-y-1.5 pr-0.5">
                        {loading && notifications.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-400">
                                <div className="h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                Loading live notifications...
                            </div>
                        ) : displayedNotifications.length > 0 ? (
                            displayedNotifications.map((item) => {
                                const isUnread = !item.read;
                                return (
                                    <div
                                        key={item._id || item.createdAt}
                                        onClick={() => handleItemClick(item)}
                                        className={`group relative flex items-start gap-3 rounded-xl p-2.5 text-left transition cursor-pointer border ${
                                            isUnread
                                                ? 'bg-indigo-50/40 border-indigo-100 hover:bg-indigo-50/80'
                                                : 'bg-white border-transparent hover:bg-slate-50'
                                        }`}
                                    >
                                        {getTypeIcon(item.type)}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className={`text-xs font-semibold truncate ${
                                                    isUnread ? 'text-indigo-950 font-bold' : 'text-slate-800'
                                                }`}>
                                                    {item.title}
                                                </p>
                                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                                    {formatRelativeTime(item.createdAt)}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                {item.message}
                                            </p>
                                        </div>

                                        {/* Actions: delete on hover */}
                                        <div className="flex items-center gap-1 shrink-0 self-center">
                                            {isUnread && (
                                                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(item._id);
                                                }}
                                                title="Delete notification"
                                                className="opacity-0 group-hover:opacity-100 rounded p-1 text-slate-400 hover:bg-slate-200/70 hover:text-red-600 transition cursor-pointer"
                                            >
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-8 text-center text-slate-400">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="text-xs font-semibold text-slate-700">No notifications found</p>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    {filter === 'unread' ? 'All caught up! No unread notifications.' : 'New complaints and inquiries will appear here.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
