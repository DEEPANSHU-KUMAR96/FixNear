import { Link } from 'react-router';

export default function HeroSection({ onOpenReportModal }) {
  return (
    <section id="home" className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 bg-gradient-to-b from-sky-50/70 via-sky-50/20 to-white overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-sky-100/80 text-sky-600 border border-sky-200/60 shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Cleaner Cities, Better Communities
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold text-slate-900 tracking-tight leading-[1.14] mb-5">
              Report Local Issues, <br className="hidden sm:inline" />
              <span className="text-slate-900">Make a Real Change</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              FixNear helps citizens report and track civic issues like potholes, water leakage, streetlight problems and more. Together we can build a better, cleaner and safer community.
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenReportModal}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Report an issue
              </button>

              <Link
                to="/issues"
                className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-blue-600 bg-white hover:bg-blue-50/60 active:scale-98 border border-blue-200 hover:border-blue-300 rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Issues
              </Link>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 bg-white group">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Modern clean city with greenery and blue sky"
                className="w-full h-72 sm:h-96 lg:h-[400px] object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
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

        {/* 4 Feature Highlights */}
        <div className="mt-14 sm:mt-18 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-sky-300 text-sky-500 bg-sky-50/50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="5" y="4" width="14" height="16" rx="2" strokeWidth="2" />
                <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" strokeLinecap="round" />
                <line x1="9" y1="13" x2="15" y2="13" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">Easy Reporting</h3>
              <p className="text-xs sm:text-sm text-slate-500">Submit issues in minutes</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-amber-300 text-amber-500 bg-amber-50/50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <polyline points="12 7 12 12 15 15" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">Track Progress</h3>
              <p className="text-xs sm:text-sm text-slate-500">Stay updated in real-time</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-sky-300 text-sky-500 bg-sky-50/50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">Transparent Process</h3>
              <p className="text-xs sm:text-sm text-slate-500">See how issues are resolved</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border border-amber-300 text-amber-500 bg-amber-50/50 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">Stronger Communities</h3>
              <p className="text-xs sm:text-sm text-slate-500">Be part of the change</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

