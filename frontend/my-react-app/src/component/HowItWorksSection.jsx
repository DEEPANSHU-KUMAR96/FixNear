export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
            How FixNear Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From report to resolution, we keep you informed every step of the way with total transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-sm">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Spot & Submit</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Notice a broken streetlight or open pothole? Submit a quick report with the location and description.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-sm">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verified & Dispatched</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The issue is automatically routed and verified with local municipal teams and maintenance crews.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mb-5 shadow-sm">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Fixed & Documented</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Receive live status updates until the problem is marked resolved with before-and-after proof.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

