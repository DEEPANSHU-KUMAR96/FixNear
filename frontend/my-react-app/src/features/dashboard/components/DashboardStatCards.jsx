export default function DashboardStatCards({ stats }) {
  const cards = [
    {
      id: 'total',
      label: 'Total Complaints',
      value: stats?.total ?? 0,
      valueClass: 'text-slate-900',
      iconBg: 'bg-blue-600',
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: stats?.inProgress ?? 0,
      valueClass: 'text-amber-500',
      iconBg: 'bg-amber-500',
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'resolved',
      label: 'Resolved',
      value: stats?.resolved ?? 0,
      valueClass: 'text-slate-900',
      iconBg: 'bg-emerald-600',
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      id: 'reported',
      label: 'Reported',
      value: stats?.reported ?? 0,
      valueClass: 'text-slate-900',
      iconBg: 'bg-slate-700',
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
        >
          {/* Top row: Icon container on left, arrow indicator on right */}
          <div className="flex items-center justify-between">
            <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center shadow-xs`}>
              {card.icon}
            </div>

            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
          </div>

          {/* Number + Label */}
          <div className="mt-4">
            <h3 className={`text-3xl font-extrabold ${card.valueClass} tracking-tight leading-none`}>
              {card.value}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

