import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../features/auth/hooks/useAuth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (e, target) => {
    if (target.startsWith('#')) {
      if (location.pathname === '/') {
        e.preventDefault();
        const elem = document.querySelector(target);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + target);
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 via-teal-500 to-sky-500 flex items-center justify-center shadow-sm text-white group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              Fix<span className="text-emerald-600">Near</span>
            </span>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Home
            </Link>

            <Link
              to="/issues"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/issues' ? 'text-emerald-600 font-semibold' : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Issues
            </Link>

            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              About
            </a>

            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, '#how-it-works')}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              How it works
            </a>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl border border-purple-200 transition"
                  >
                    Admin
                  </Link>
                )}

                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    {(user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                    {user?.name || 'Citizen'}
                  </span>
                </div>

                <button
                  onClick={() => logout()}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-100 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-xl hover:bg-blue-50/40 transition shadow-2xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs hover:shadow transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-emerald-600"
            >
              Home
            </Link>
            <Link
              to="/issues"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-emerald-600"
            >
              Issues
            </Link>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, '#about')}
              className="px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-emerald-600"
            >
              About
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavClick(e, '#how-it-works')}
              className="px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-emerald-600"
            >
              How it works
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-emerald-600"
            >
              Contact
            </a>
          </nav>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-2xs"
                >
                  Go to Dashboard
                </Link>
                <span className="text-sm font-medium text-slate-700">
                  {user?.name || 'Citizen'}
                </span>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    Admin Inbox
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
