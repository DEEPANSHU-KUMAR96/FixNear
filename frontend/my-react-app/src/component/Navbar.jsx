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
                  to="/issues"
                  className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
                >
                  My Issues
                </Link>
                <span className="text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  Hi, {user?.name || 'Citizen'}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-blue-600 border border-blue-400 rounded-lg hover:bg-blue-50/70 hover:border-blue-500 transition shadow-2xs"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs hover:shadow transition"
                >
                  Sign Up
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {user?.name || 'Citizen'}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-md"
                >
                  Logout
                </button>
              </div>
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
