import axios from "axios";
import { getStoredAccessToken } from "../../auth/services/auth.service";

const API_URL = axios.create({
    baseURL: import.meta.env.VITE_URL || "http://localhost:3000/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

const authConfig = () => {
    const token = getStoredAccessToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const getErrorMessage = (error) =>
    error.response?.data?.message || error.message || "Admin request failed";

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
