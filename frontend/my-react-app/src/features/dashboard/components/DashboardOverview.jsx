import DashboardStatCards from './DashboardStatCards';
import ComplaintItem from './ComplaintItem';

export default function DashboardOverview({
  user,
  stats,
  recentComplaints,
  isLoading,
  onViewAll,
  onOpenReport,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s an overview of your complaints
        </p>
      </div>

      {/* 4 Stats Cards */}
      <DashboardStatCards stats={stats} />

      {/* Recent Complaints Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Recent Complaints
          </h2>

          <button
            type="button"
            onClick={onViewAll}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            View All
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs sm:text-sm">Loading your complaints...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && recentComplaints.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-2xs">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
              📝
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Complaints Reported Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
              Notice a civic problem like broken streetlights or potholes? Report it to notify authorities.
            </p>
            <button
              type="button"
              onClick={onOpenReport}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              + Report an Issue
            </button>
          </div>
        )}

        {/* Complaints list */}
        {!isLoading && recentComplaints.length > 0 && (
          <div className="space-y-3">
            {recentComplaints.map((issue) => (
              <ComplaintItem
                key={issue._id}
                issue={issue}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

