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

// Automatic Authorization and Content-Type negotiation
Api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

const getErrorMessage = (err) => {
    if (err.response?.data?.message) {
        return err.response.data.message;
    }
    if (err.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
        return err.response.data.errors.map(e => e.msg || e.message).join('. ');
    }
    if (typeof err.response?.data === 'string') {
        return err.response.data;
    }
    if (err.message) {
        return err.message;
    }
    return 'An unexpected error occurred';
};

const toIssuePayload = (data) => {
    if (typeof File !== 'undefined' && data?.image instanceof File) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'image' && value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });
        formData.append('image', data.image);
        return formData;
    }

    const payload = { ...data };
    if (!payload.image) {
        delete payload.image;
    }
    return payload;
};

export async function createIssue(data) {
    try {
        const payload = toIssuePayload(data);
        const response = await Api.post('issues/create', payload);
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        error.response = err.response ? { data: err.response.data, status: err.response.status } : undefined;
        throw error;
    }
}

export async function getAllIssues() {
    try {
        const response = await Api.get('issues/all');
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function getMyIssues() {
    try {
        const response = await Api.get('issues/get-issue');
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function searchIssues(query = '') {
    try {
        const response = await Api.get(`issues/my?search=${encodeURIComponent(query)}`);
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function getSingleIssue(id) {
    try {
        const response = await Api.get(`issues/${id}`);
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function updateIssue(id, updates) {
    try {
        const payload = toIssuePayload(updates);
        const response = await Api.patch(`issues/${id}`, payload);
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function updateIssueStatus(id, status) {
    try {
        const response = await Api.patch(`issues/${id}/status`, { status });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function deleteIssue(id) {
    try {
        const response = await Api.delete(`issues/${id}`);
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function upvoteIssue(id) {
    try {
        const response = await Api.post(`issues/${id}/upvote`, {});
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}
