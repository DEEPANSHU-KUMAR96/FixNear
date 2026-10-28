import React, { useState } from 'react'
import { Link } from 'react-router'
import useAuth from '../hooks/useAuth'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [localError, setLocalError] = useState('')
    const { forgotPassword, isLoading, error } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccessMessage('')
        setLocalError('')

        if (!email.trim()) {
            setLocalError('Please enter your email')
            return
        }

        try {
            const res = await forgotPassword(email)
            setSuccessMessage(res?.message || 'Password reset link sent to your email!')
        } catch (err) {
            setLocalError(err?.message || (typeof err === 'string' ? err : 'Failed to send reset link'))
        }
    }

    const displayError = localError || (typeof error === 'string' ? error : error?.message)

    return (
        <main className='w-full h-screen flex justify-center items-center'>
            <div className='form-container gap-2 w-96 p-10 bg-white rounded-lg shadow-lg'>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <h1 className='text-center text-2xl font-bold mb-2'>Forgot Password</h1>
                    <p className='text-center text-sm text-gray-600 mb-2'>
                        Enter your registered email and we'll send you a password reset link.
                    </p>

                    {successMessage && (
                        <div className='p-3 bg-green-100 text-green-800 rounded text-sm'>
                            {successMessage}
                        </div>
                    )}

                    {displayError && (
                        <div className='p-3 bg-red-100 text-red-800 rounded text-sm'>
                            {displayError}
                        </div>
                    )}

                    <label htmlFor="email">Email</label>
                    <input 
                        className='p-2 border border-gray-300 rounded' 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder='name@example.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />

                    <button 
                        className='bg-primary text-black border border-gray-900 p-2 rounded cursor-pointer hover:scale-105 active:scale-95 hover:font-bold transition-all disabled:opacity-50' 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className='mt-4 text-center text-sm'>
                    Remember your password? <Link to="/login" className='text-primary font-bold'>Login</Link>
                </p>
            </div>
        </main>
    )
}

export default ForgotPassword