import React from 'react';

export default function Footer({ onGoLanding, onGoDashboard }) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-xl text-slate-950 shadow-lg shadow-cyan-500/20">
                S
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                ST<span className="text-cyan-400">Art</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Subscription Tracking Application built on the MERN Stack as a 100% free college mini-project tool. Eliminate wasted recurring fees and manage budgets seamlessly.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MERN Stack Engine Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><button onClick={onGoLanding} className="hover:text-white transition-colors">Home Page</button></li>
              <li><button onClick={onGoDashboard} className="hover:text-white transition-colors">Full Interactive Dashboard</button></li>
              <li><a href="#features" className="hover:text-white transition-colors">Smart Features</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Savings Calculator</a></li>
              <li><a href="#feedback" className="hover:text-white transition-colors">Community Feedback</a></li>
            </ul>
          </div>

          {/* Technology Stack Tags */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">MERN Stack Architecture</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-300">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> MongoDB
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Express API
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-300" /> React 19
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Node.js
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} STArt - Subscription Tracking Application. 100% Free Mini Project.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-400 transition-colors">GitHub Repository</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
