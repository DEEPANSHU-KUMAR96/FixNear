import axios from 'axios';

const Api = axios.create({
    baseURL: import.meta.env.VITE_URL || 'http://localhost:3000/api/',
    withCredentials: true,
});

const getToken = () => {
    const raw = localStorage.getItem('token');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : raw;
    } catch {
        return raw;
    }
};

Api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

export async function fetchNotifications() {
    try {
        const response = await Api.get('notifications');
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

export async function markAllNotificationsAsRead() {
    try {
        const response = await Api.patch('notifications/read-all');
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

export async function markNotificationAsRead(id) {
    try {
        const response = await Api.patch(`notifications/${id}/read`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

export async function deleteNotification(id) {
    try {
        const response = await Api.delete(`notifications/${id}`);
        return response.data;
    } catch (err) {
        throw err.response?.data || err;
    }
}

