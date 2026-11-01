import { useState } from 'react';
import { Link } from 'react-router';
import useAuth from '../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');
  const { forgotPassword, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Please enter your email');
      return;
    }

    try {
      const res = await forgotPassword(email);
      setSuccessMessage(res?.message || 'Password reset link sent to your email!');
    } catch (err) {
      setLocalError(err?.message || (typeof err === 'string' ? err : 'Failed to send reset link'));
    }
  };

  const displayError = localError || (typeof error === 'string' ? error : error?.message);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
          FN
        </div>
        <span className="text-2xl font-bold text-slate-900">
          Fix<span className="text-emerald-600">Near</span>
        </span>
      </Link>

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-1">Forgot Password</h1>
        <p className="text-center text-xs sm:text-sm text-slate-500 mb-6">
          Enter your registered email and we'll send you a password reset link.
        </p>

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs">
            {successMessage}
          </div>
        )}

        {displayError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            {displayError}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              type="email"
              name="email"
              id="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2.5 rounded-lg shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
          Remember your password?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;
