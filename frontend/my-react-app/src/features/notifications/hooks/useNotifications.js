import { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    deleteNotification as deleteNotificationApi,
} from '../services/notification.service';

export function useNotifications({ pollInterval = 30000, fallbackItems } = {}) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isFetchingRef = useRef(false);
    const fallbackRef = useRef(fallbackItems);

    useEffect(() => {
        fallbackRef.current = fallbackItems;
    }, [fallbackItems]);

    const loadNotifications = useCallback(async (isSilent = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        if (!isSilent) setLoading(true);
        setError(null);

        try {
            const res = await fetchNotifications();
            if (res?.success && Array.isArray(res.notifications)) {
                setNotifications(res.notifications);
                const count = typeof res.unreadCount === 'number'
                    ? res.unreadCount
                    : res.notifications.filter((n) => !n.read).length;
                setUnreadCount(count);
            } else if (Array.isArray(fallbackRef.current) && fallbackRef.current.length > 0) {
                setNotifications(fallbackRef.current);
                setUnreadCount(fallbackRef.current.filter((n) => !n.read).length);
            }
        } catch (err) {
            console.warn('Failed to load notifications:', err);
            setError(err?.message || 'Failed to fetch notifications');
            if (Array.isArray(fallbackRef.current) && fallbackRef.current.length > 0) {
                setNotifications(fallbackRef.current);
                setUnreadCount(fallbackRef.current.filter((n) => !n.read).length);
            }
        } finally {
            isFetchingRef.current = false;
            if (!isSilent) setLoading(false);
        }
    }, []);

    // Keep ref to loadNotifications so interval doesn't reset on function change
    const loadRef = useRef(loadNotifications);
    useEffect(() => {
        loadRef.current = loadNotifications;
    }, [loadNotifications]);

    // Initial load and background polling
    useEffect(() => {
        let mounted = true;
        // Asynchronous invocation avoids synchronous setState in effect
        Promise.resolve().then(() => {
            if (mounted) {
                loadRef.current(false);
            }
        });

        if (!pollInterval || pollInterval <= 0) return () => { mounted = false; };

        const timer = setInterval(() => {
            if (mounted) {
                loadRef.current(true);
            }
        }, pollInterval);

        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [pollInterval]);

    const markAllRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        try {
            await markAllNotificationsAsRead();
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    }, []);

    const markSingleRead = useCallback(async (id) => {
        if (!id) return;
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        try {
            if (!String(id).startsWith('local-')) {
                await markNotificationAsRead(id);
            }
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    }, []);

    const removeNotification = useCallback(async (id) => {
        if (!id) return;
        const target = notifications.find((n) => n._id === id);
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        if (target && !target.read) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        try {
            if (!String(id).startsWith('local-')) {
                await deleteNotificationApi(id);
            }
        } catch (err) {
            console.error('Failed to delete notification:', err);
        }
    }, [notifications]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        refresh: () => loadNotifications(false),
        markAllRead,
        markSingleRead,
        removeNotification,
    };
}
