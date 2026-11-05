import { Link } from 'react-router';
import useAuth from '../features/auth/hooks/useAuth';

export default function HeroSection({ onOpenReportModal }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <section id="home" className="relative pt-6 pb-16 lg:pt-12 lg:pb-20 bg-linear-to-b from-sky-50/70 via-sky-50/20 to-white overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {isAuthenticated ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 shadow-2xs mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Welcome back, {user?.name || 'Citizen'} • Connected
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-100/80 text-sky-700 border border-sky-200/60 shadow-2xs mb-5">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                Cleaner Cities, Better Communities
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold text-slate-900 tracking-tight leading-[1.14] mb-5">
              Report Local Issues, <br className="hidden sm:inline" />
              <span className="text-slate-900">Make a Real Change</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              FixNear empowers residents to report, track, and resolve neighborhood problems like potholes, broken streetlights, water leaks, and trash overflow with verified municipal accountability.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Report an Issue
              </button>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 active:scale-98 border border-blue-200 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
                >
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  My Dashboard
                </Link>
              ) : (
                <Link
                  to="/issues"
                  className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:scale-98 border border-slate-200 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Explore Issues
                </Link>
              )}
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white group">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Modern clean city with greenery and blue sky"
                className="w-full h-72 sm:h-96 lg:h-95 object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">1,420+ Issues Fixed</p>
                  <p className="text-[11px] text-slate-500">Across 85+ Neighborhoods</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Live Civic Metric Highlights */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,420+</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Issues Resolved</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">94%</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Resolution Rate</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">48 hrs</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Avg Response Time</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">85+</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Active Neighborhoods</p>
          </div>
        </div>
      </div>
    </section>
  );
}

