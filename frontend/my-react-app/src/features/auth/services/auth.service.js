import axios from 'axios';

const API_URL = axios.create({
    baseURL: import.meta.env.VITE_URL || 'http://localhost:3000/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
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

export async function registerUser(name, email, password, role){
    try{
        const res = await API_URL.post('auth/register', { name, email, password, role });
        if(res.data?.token || res.data?.accessToken){
            const token = res.data.token || res.data.accessToken;
            localStorage.setItem('token', JSON.stringify(token));
        }
        return res.data;
    }catch(err){
        const errorObj = new Error(getErrorMessage(err));
        errorObj.response = err.response ? { data: err.response.data, status: err.response.status } : undefined;
        throw errorObj;
    }
}

export async function loginUser(email, password){
    try{
        const res = await API_URL.post('auth/login', { email, password });
        if(res.data?.token || res.data?.accessToken){
            const token = res.data.token || res.data.accessToken;
            localStorage.setItem('token', JSON.stringify(token));
        }
        return res.data;
    }catch(err){
        const errorObj = new Error(getErrorMessage(err));
        errorObj.response = err.response ? { data: err.response.data, status: err.response.status } : undefined;
        throw errorObj;
    }
}

export const getStoredAccessToken = () => {
    const raw = localStorage.getItem('token');
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw);
        return typeof parsed === 'string' ? parsed : raw;
    } catch {
        return raw;
    }
};

export async function logoutUser(){
    try{
        const token = getStoredAccessToken();
        await API_URL.post('auth/logout', {}, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        localStorage.removeItem('token');
        return {
            user: null,
            token: null,
            isAuthenticated: false
        };
    }catch(err){
        const errorObj = new Error(getErrorMessage(err));
        throw errorObj;
    }
}

export async function getUser(){
    try{
        const token = getStoredAccessToken();
        const res = await API_URL.get('auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        return res.data;
    }catch(err){
        const errorObj = new Error(getErrorMessage(err));
        throw errorObj;
    }
}

export async function forgotPassword(email){
    try{
        const res = await API_URL.post('auth/forgot-password', { email });
        return res.data;
    }catch(err){
        const errorObj = new Error(getErrorMessage(err));
        throw errorObj;
    }
}

export async function resetPassword(token, password){
    try{
        const res = await API_URL.post('auth/reset-password', { token, password });
        return res.data;
    }catch(err){
        const errorObj = new Error(getErrorMessage(err));
        throw errorObj;
    }
}
