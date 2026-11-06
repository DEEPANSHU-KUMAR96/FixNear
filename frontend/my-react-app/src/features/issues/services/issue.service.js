import axios from 'axios';

const Api = axios.create({
    baseURL: import.meta.env.VITE_URL || 'http://localhost:3000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
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

const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    if (typeof File === 'undefined' || !(data?.image instanceof File)) {
        return data;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'image' && value !== undefined && value !== null) {
            formData.append(key, value);
        }
    });
    formData.append('image', data.image);
    return formData;
};

const getIssueRequestConfig = (payload) => ({
    headers: {
        ...getAuthHeaders(),
        ...(typeof FormData !== 'undefined' && payload instanceof FormData
            ? { 'Content-Type': 'multipart/form-data' }
            : {}),
    },
});

export async function createIssue(data) {
    try {
        const payload = toIssuePayload(data);
        const response = await Api.post('issues/create', payload, getIssueRequestConfig(payload));
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        error.response = err.response ? { data: err.response.data, status: err.response.status } : undefined;
        throw error;
    }
}

export async function getAllIssues() {
    try {
        const response = await Api.get('issues/all', {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function getMyIssues() {
    try {
        const response = await Api.get('issues/get-issue', {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function searchIssues(query = '') {
    try {
        const response = await Api.get(`issues/my?search=${encodeURIComponent(query)}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function getSingleIssue(id) {
    try {
        const response = await Api.get(`issues/${id}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function updateIssue(id, updates) {
    try {
        const payload = toIssuePayload(updates);
        const response = await Api.patch(`issues/${id}`, payload, getIssueRequestConfig(payload));
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function updateIssueStatus(id, status) {
    try {
        const response = await Api.patch(`issues/${id}/status`, { status }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function deleteIssue(id) {
    try {
        const response = await Api.delete(`issues/${id}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}

export async function upvoteIssue(id) {
    try {
        const response = await Api.post(`issues/${id}/upvote`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (err) {
        const error = new Error(getErrorMessage(err));
        throw error;
    }
}
