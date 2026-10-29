import axios from 'axios'

const API_URL = axios.create({
    baseURL: import.meta.env.VITE_URL || 'http://localhost:3000/api/auth',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export async function registerUser(name, email, password, role){
    try{
        const res = await API_URL.post('auth/register', {name, email, password, role})
        if(res.data?.token){
            localStorage.setItem('token', JSON.stringify(res.data.token))
        }
        return res.data
    }catch(err){
        throw err.response?.data || err
    }
}

export async function loginUser(email, password){
    try{
        const res = await API_URL.post('auth/login', {email, password})
        if(res.data?.token){
            localStorage.setItem('token', JSON.stringify(res.data.token))
        }
        return res.data
    }catch(err){
        throw err.response?.data || err
    }
}

const getToken = () => {
    const raw = localStorage.getItem('token')
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        return typeof parsed === 'string' ? parsed : raw
    } catch {
        return raw
    }
}

export async function logoutUser(){
    try{
        const token = getToken()
        const res = await API_URL.post('auth/logout', null, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        localStorage.removeItem('token')
        return {
            user: null,
            token: null,
            isAuthenticated: false
        }
    }catch(err){
        throw err.response?.data || err
    }
}

export async function getUser(){
    try{
        const token = getToken()
        const res = await API_URL.get('auth/me', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
        return res.data
    }catch(err){
        throw err.response?.data || err
    }
}

export async function forgotPassword(email){
    try{
        const res = await API_URL.post('auth/forgot-password', {email})
        return res.data
    }catch(err){
        throw err.response?.data || err
    }
}

export async function resetPassword(token, password){
    try{
        const res = await API_URL.post('auth/reset-password', {token, password})
        return res.data
    }catch(err){
        throw err.response?.data || err
    }
}