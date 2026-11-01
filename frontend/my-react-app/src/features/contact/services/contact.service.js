import axios from "axios";

const API_URL = axios.create({
    baseURL: import.meta.env.VITE_URL || "http://localhost:3000/api/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function createContact(contactDetails) {
    try {
        const response = await API_URL.post("contacts/create", contactDetails);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || error.message || "Failed to send inquiry",
            { cause: error }
        );
    }
}
