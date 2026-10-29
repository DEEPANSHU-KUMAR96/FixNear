import axios from 'axios'

const Api = axios.create({
    baseURL: import.meta.env.VITE_URL || 'http://localhost:3000/api/issues',
    withCredentials: true,
})

export async function createIssues(title, description, category, location, status, priority) {
    try {
        const response = await Api.post('issues/create', { title, description, category, location, status, priority, })
        return response.data
    } catch (err) {
        throw err.response?.data || err
 }    
}