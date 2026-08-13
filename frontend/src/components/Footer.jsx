import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand & Mission Column (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
                S
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                STArt
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Subscription Tracking Application built on the MERN Stack. Eliminate wasted recurring fees, automate renewal alerts, and take full control of your cash flow.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                MERN Stack Engine Active
              </span>
            </div>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Product Navigation</h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-medium">
              <li><a href="#features" className="hover:text-white transition-colors">Smart Features</a></li>
              <li><a href="#dashboard-preview" className="hover:text-white transition-colors">Interactive Dashboard</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Savings & ROI Calculator</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing & Plans</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">User Reviews</a></li>
            </ul>
          </div>

          {/* Technology Stack Tags (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white">Built With MERN Architecture</h4>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-300">
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> MongoDB Database
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Express REST API
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-cyan-400/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> React 19 Engine
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-500/30 transition-colors flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Node.js Backend
              </span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-medium">
          <p>© {new Date().getFullYear()} STArt - Subscription Tracking Application. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">College Project Documentation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
