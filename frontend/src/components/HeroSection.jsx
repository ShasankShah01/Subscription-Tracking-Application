import React from 'react';

export default function HeroSection({ onDashboardClick }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-800/60">
      {/* Background Ambient Lighting & Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-emerald-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[35%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[130px]" />

        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* College Project Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300 shadow-xl backdrop-blur-md mb-8 hover:border-cyan-500/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-slate-400">100% Free College Project</span>
          <span className="text-slate-600">•</span>
          <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent font-semibold">
            MERN Stack Utility Tool
          </span>
        </div>

        {/* Title with Vibrant Gradient */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white mb-8">
          Take Control of Your{' '}
          <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            STArt - Subscription Tracker
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto mb-12">
          Track all your recurring expenses, eliminate forgotten auto-renewals, and analyze monthly cash flow in one clean, high-performance workspace. Completely free forever.
        </p>

        {/* Next-Gen Interactive CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <button
            onClick={onDashboardClick}
            className="w-full sm:w-auto relative group overflow-hidden px-9 py-4 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Dashboard
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          <a
            href="#calculator"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate Savings
          </a>
        </div>

        {/* Key Project Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100% Free</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Open Mini-Project</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">MERN Stack</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Mongo + Express + React + Node</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-cyan-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 tracking-tight">Zero Fees</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">No Commercial Paywalls</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">&lt; 50ms</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Lightning Fast Response</div>
          </div>
        </div>
      </div>
    </section>
  );
}
