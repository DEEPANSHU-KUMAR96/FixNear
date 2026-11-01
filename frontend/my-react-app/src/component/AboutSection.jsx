import { Link } from 'react-router';

export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-4 mb-5 leading-tight">
              Empowering Citizens to Build Cleaner, Smarter Cities
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              FixNear is a civic-tech initiative dedicated to modernizing municipal accountability. By giving residents a direct, transparent channel to highlight civic infrastructure problems, we turn frustration into measurable community progress.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <p className="text-3xl font-extrabold text-emerald-400">94%</p>
                <p className="text-xs text-slate-400 mt-1">Resolution Rate</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-sky-400">48 hrs</p>
                <p className="text-xs text-slate-400 mt-1">Avg Response</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-amber-400">85+</p>
                <p className="text-xs text-slate-400 mt-1">Neighborhoods</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-xl">
            <h3 className="text-xl font-bold mb-3">Join Your Local Action Network</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Connect with neighbors, upvote urgent civic needs, and follow municipal progress reports right from your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="px-6 py-3 text-center text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 text-center text-sm font-semibold text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

