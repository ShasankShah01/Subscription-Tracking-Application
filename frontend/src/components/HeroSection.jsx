import React from 'react';

export default function HeroSection({ onDashboardClick }) {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-white/5">
      {/* Background Ambient Lighting & Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-violet-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[35%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px]" />
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-medium text-zinc-300 shadow-xl backdrop-blur-md mb-8 hover:border-indigo-500/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-zinc-400">Introducing</span>
          <span className="font-semibold text-white">STArt v1.0</span>
          <span className="text-zinc-600">•</span>
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent font-semibold">
            Next-Gen Subscription Tracking
          </span>
        </div>

        {/* Dynamic Title with Vibrant Gradient */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white mb-8">
          Master Your Expenses with{' '}
          <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            STArt - Subscription Tracking
          </span>
        </h1>

        {/* Polished Typography Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl text-zinc-400 font-normal leading-relaxed max-w-3xl mx-auto mb-12">
          Eliminate hidden charges, automate renewal alerts, and optimize monthly cash flow. 
          STArt empowers you to track all your software, streaming, and recurring bills in one intuitive, high-performance platform.
        </p>

        {/* Next-Gen Interactive Call-to-Action Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          {/* Primary View Dashboard CTA Button */}
          <button
            onClick={onDashboardClick}
            className="w-full sm:w-auto relative group overflow-hidden px-9 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/40 flex items-center justify-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Dashboard
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            {/* Sheen sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          {/* Secondary Action Button */}
          <a
            href="#calculator"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 hover:border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate Waste
          </a>
        </div>

        {/* Live Metrics Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md text-center hover:border-indigo-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">\$14,200+</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">User Savings Tracked</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md text-center hover:border-violet-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">100%</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Auto-Renewal Alerts</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md text-center hover:border-emerald-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">4.9 / 5</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">Student Rating</div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md text-center hover:border-indigo-500/30 transition-colors">
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">&lt; 50ms</div>
            <div className="text-xs text-zinc-400 mt-1 font-medium">MERN Engine Speed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
