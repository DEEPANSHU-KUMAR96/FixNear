import { Link } from 'react-router';

export default function FooterSection() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
            FN
          </div>
          <span className="text-lg font-bold text-white">Fix<span className="text-emerald-400">Near</span></span>
          <span className="text-xs text-slate-500 ml-2">© {new Date().getFullYear()} All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6 text-xs text-slate-400">
          <a href="#home" className="hover:text-white transition">Home</a>
          <Link to="/issues" className="hover:text-white transition">Issues</Link>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#how-it-works" className="hover:text-white transition">How it works</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
          <Link to="/login" className="hover:text-white transition">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}

