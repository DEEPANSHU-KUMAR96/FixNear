import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    })

    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        register(formData.name, formData.email, formData.password, formData.role)
        navigate('/')
    }

    return (
        <main className='w-full h-screen flex justify-center items-center'>
            <div className='form-container  gap-2 w-96 p-10 bg-white rounded-lg shadow-lg'>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

                    <h1 className='text-center text-2xl font-bold mb-4'>Register Form</h1>

                    <label htmlFor="name">Name</label>
                    <input className='p-2 border border-gray-300 rounded' type="text" name="name" id="name"
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                    <label htmlFor="email">Email</label>
                    <input className='p-2 border border-gray-300 rounded' type="email" name="email" id="email" 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    
                    <label htmlFor="password">Password</label>
                    <input className='p-2 border border-gray-300 rounded' type="password" name="password" id="password"
                     onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    
                    <label htmlFor="role">Role</label>
                    <select className='p-2 border border-gray-300 rounded' name="role" id="role"
                     onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button className='bg-primary text-black border border-gray-900 p-2 rounded cursor-pointer hover:scale-105 active:scale-95 hover:font-bold transition-all' type="submit">Register</button>

                    
                </form>
                <p>Already have an account? <Link to="/login" className='text-primary font-bold'>Login</Link></p>

            </div>
        </main>
    )
}

export default Register