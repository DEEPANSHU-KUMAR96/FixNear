export default function IssueStatsBar({ stats }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Issues</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">New Reports</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">{stats.reported}</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">In Progress</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{stats.inProgress}</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Resolved</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{stats.resolved}</p>
            </div>
        </div>
    );
}

