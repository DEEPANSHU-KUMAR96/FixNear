import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      await login(formData.email.trim(), formData.password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.message || (typeof err === 'string' ? err : 'Login failed. Please check credentials.'));
    }
  };

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
        <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-1">Welcome Back</h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Log in to track your reported civic issues
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
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
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="password">
                Password (min. 6 characters)
              </label>
              <Link to="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot?
              </Link>
            </div>
            <input
              className="w-full p-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              type="password"
              name="password"
              id="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-2.5 rounded-lg shadow-sm hover:shadow transition disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Login;
