import { useMemo } from 'react';

export default function ProfileView({ user, stats }) {
  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent Citizen';

  const resolutionRate = useMemo(() => {
    if (!stats?.total || stats.total === 0) return 0;
    return Math.round(((stats.resolved || 0) / stats.total) * 100);
  }, [stats]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Citizen Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Citizen Profile & Stats
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, credentials, and civic contribution metrics.
          </p>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-50 via-teal-50/30 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          {/* Avatar */}
          <div className="relative">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-3xl shadow-md border-4 border-white">
                {user?.name?.[0]?.toUpperCase() || 'C'}
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs shadow-xs"
              title="Verified Citizen"
            >
              ✓
            </span>
          </div>

          {/* User Info */}
          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate capitalize">
                {user?.name || (user?.email ? user.email.split('@')[0] : 'Citizen')}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 capitalize self-center sm:self-auto shrink-0 border border-emerald-200">
                🛡️ {user?.role || 'Citizen'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <span>✉️</span>
              <span className="truncate">{user?.email}</span>
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span>📅</span> Joined {memberDate}
              </span>
              <span className="flex items-center gap-1">
                <span>📍</span> Active Citizen
              </span>
            </div>
          </div>
        </div>

        {/* Civic Activity Metric Cards */}
        <div className="pt-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Civic Contribution Overview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Reported */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100/70 transition">
              <span className="text-xl mb-1 block">📋</span>
              <p className="text-2xl font-extrabold text-slate-900">{stats?.total || 0}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Complaints Filed</p>
            </div>

            {/* In Progress */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100/70 text-center hover:bg-amber-100/60 transition">
              <span className="text-xl mb-1 block">⏳</span>
              <p className="text-2xl font-extrabold text-amber-700">{stats?.inProgress || 0}</p>
              <p className="text-xs font-medium text-amber-800 mt-0.5">In Progress</p>
            </div>

            {/* Resolved */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/70 text-center hover:bg-emerald-100/60 transition">
              <span className="text-xl mb-1 block">✅</span>
              <p className="text-2xl font-extrabold text-emerald-700">{stats?.resolved || 0}</p>
              <p className="text-xs font-medium text-emerald-800 mt-0.5">Resolved</p>
            </div>

            {/* Resolution Rate */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/70 text-center hover:bg-indigo-100/60 transition">
              <span className="text-xl mb-1 block">📈</span>
              <p className="text-2xl font-extrabold text-indigo-700">{resolutionRate}%</p>
              <p className="text-xs font-medium text-indigo-800 mt-0.5">Resolution Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid: Account Info + Civic Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm">
              👤
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Account Credentials</h3>
              <p className="text-xs text-slate-500">Your verified authentication records</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Full Legal Name</span>
                <span className="text-sm font-bold text-slate-800">{user?.name || 'Citizen'}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Active
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Email Address</span>
                <span className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{user?.email}</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Verified
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">System Role</span>
                <span className="text-sm font-bold text-slate-800 capitalize">{user?.role || 'Citizen'}</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Standard
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block uppercase">Auth Provider</span>
                <span className="text-sm font-bold text-slate-800 uppercase">{user?.authProvider || 'Email/Password'}</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Secure
              </span>
            </div>
          </div>
        </div>

        {/* Civic Reporting Guidelines Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold">
                🏛️
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">How FixNear Works</h3>
                <p className="text-xs text-slate-500">Citizen resolution process & stages</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-800">1. Report Dispatched</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Once submitted, AI categorizes and checks for duplicates, placing your issue in the municipal dispatch queue.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-800">2. Ward Assignment</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Municipal teams inspect the location and update ticket status to &quot;In Progress&quot;.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-800">3. Resolution & Closure</p>
                  <p className="text-slate-500 mt-0.5 leading-relaxed">
                    Upon repair completion, the complaint is marked &quot;Resolved&quot; and recorded in your citizen dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>FixNear Citizen Verification</span>
            <span className="text-emerald-600 font-semibold">100% Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
