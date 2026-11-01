export default function StatCard({ label, value, borderColor, icon }) {
    return (
        <div className={`rounded-xl border-t-4 bg-white p-5 shadow-sm ${borderColor}`}>
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className="text-2xl">{icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-800">
                {value ?? <span className="text-slate-300">—</span>}
            </p>
        </div>
    );
}
