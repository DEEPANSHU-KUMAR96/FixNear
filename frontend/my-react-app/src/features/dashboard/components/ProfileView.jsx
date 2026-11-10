export default function ProfileView({ user, stats }) {
  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recent Member';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Citizen Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials and personal information
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || 'User'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 capitalize">
                {user?.name || (user?.email ? user.email.split('@')[0] : 'Citizen')}
              </h2>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 capitalize self-center sm:self-auto">
                {user?.role || 'Citizen'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
            <p className="text-xs text-slate-400 mt-2">Member since {memberDate}</p>
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-6 text-center">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100">
            <p className="text-xl font-bold text-slate-900">{stats?.total || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Reported</p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100/60">
            <p className="text-xl font-bold text-amber-600">{stats?.inProgress || 0}</p>
            <p className="text-xs text-slate-500 mt-1">In Progress</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
            <p className="text-xl font-bold text-emerald-600">{stats?.resolved || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Resolved</p>
          </div>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Account Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Full Name</span>
            <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{user?.name}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Registered Email</span>
            <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{user?.email}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Account Role</span>
            <span className="text-slate-800 font-semibold text-sm mt-0.5 block capitalize">{user?.role || 'Citizen'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Authentication Provider</span>
            <span className="text-slate-800 font-semibold text-sm mt-0.5 block uppercase">{user?.authProvider || 'Local'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

