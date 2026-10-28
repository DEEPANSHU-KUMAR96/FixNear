import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router'


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData.email, formData.password)
    navigate('/')
  }

  return (
    <main className='w-full h-screen flex justify-center items-center'>
      
      <div className='form-container  gap-2 w-96 p-10 bg-white rounded-lg shadow-lg'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

          <h1 className='text-center text-2xl font-bold mb-4'>Login Form</h1>

          <label htmlFor="email">Email</label>
          <input className='p-2 border border-gray-300 rounded' type="email" name="email" id="email" 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          
          <label htmlFor="password">Password</label>
          <input className='p-2 border border-gray-300 rounded' type="password" name="password" id="password"
           onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          <button className='bg-primary text-black border border-gray-900 p-2 rounded cursor-pointer hover:scale-105 active:scale-95 hover:font-bold transition-all' type="submit">Login</button>

          <p className='text-center text-xs'>forgot password? <Link to="/forgot-password" className='text-primary font-bold'>Forgot Password?</Link></p>
        </form>
        <p>Don't have an account? <Link to="/register" className='text-primary font-bold'>Register</Link></p>

      </div>
    </main>
  )
}

export default Login