import axios from "axios";

const API_URL = axios.create({
    baseURL: import.meta.env.VITE_URL || "http://localhost:3000/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const getToken = () => {
    const raw = localStorage.getItem("token");
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === "string" ? parsed : raw;
    } catch {
        return raw;
    }
};

const authConfig = () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || "Admin request failed";

// ── Inquiries ──────────────────────────────────────────────────────────────────

export async function getAdminInquiries() {
    try {
        const response = await API_URL.get("admin/inquiries", authConfig());
        return response.data.inquiries;
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

export async function updateAdminInquiryStatus(id, status) {
    try {
        const response = await API_URL.patch(
            `admin/inquiries/${id}/status`,
            { status },
            authConfig()
        );
        return response.data.inquiry;
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

export async function deleteAdminInquiry(id) {
    try {
        await API_URL.delete(`admin/inquiries/${id}`, authConfig());
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

// ── Stats ──────────────────────────────────────────────────────────────────────

export async function getAdminStats() {
    try {
        const response = await API_URL.get("admin/stats", authConfig());
        return response.data.stats;
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

// ── Users ──────────────────────────────────────────────────────────────────────

export async function getAdminUsers() {
    try {
        const response = await API_URL.get("admin/users", authConfig());
        return response.data.users;
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

// ── Issues ─────────────────────────────────────────────────────────────────────

export async function getAdminAllIssues() {
    try {
        const response = await API_URL.get("admin/issues", authConfig());
        return response.data.issues;
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

export async function updateAdminIssueStatus(id, status) {
    try {
        const response = await API_URL.patch(
            `admin/issues/${id}/status`,
            { status },
            authConfig()
        );
        return response.data.issue;
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}

export async function deleteAdminIssue(id) {
    try {
        await API_URL.delete(`admin/issues/${id}`, authConfig());
    } catch (error) {
        throw new Error(getErrorMessage(error), { cause: error });
    }
}
