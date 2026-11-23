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

/**
 * Calls the AI classify-issue endpoint.
 * @param {{ title: string, description: string }} payload
 * @returns {Promise<{ category: string, priority: string, summary: string, reason: string }>}
 */
export const classifyIssue = async ({ title, description }) => {
    const response = await Api.post('ai/classify-issue', { title, description });
    if (response.data?.success && response.data?.classification) {
        return response.data.classification;
    }
    throw new Error(response.data?.message || 'Classification failed');
};

/**
 * Calls the AI check-duplicates endpoint.
 * @param {{ title: string, description: string, category: string, location: string, excludeIssueId?: string }} payload
 * @returns {Promise<{ hasDuplicates: boolean, duplicates: Array }>}
 */
export const checkDuplicates = async ({ title, description, category, location, excludeIssueId }) => {
    const payload = {
        title,
        description,
        category,
        location,
        ...(excludeIssueId ? { excludeIssueId } : {}),
    };
    const response = await Api.post('ai/check-duplicates', payload);
    if (response.data?.success !== undefined) {
        return {
            hasDuplicates: response.data.hasDuplicates || false,
            duplicates: response.data.duplicates || [],
        };
    }
    throw new Error(response.data?.message || 'Duplicate check failed');
};
