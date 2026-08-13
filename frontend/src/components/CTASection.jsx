import React from 'react';

export default function CTASection({ onDashboardClick }) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Radiant ambient glow spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/10 p-10 sm:p-16 text-center backdrop-blur-2xl shadow-2xl overflow-hidden group">
          
          {/* Glass sheen highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-6">
            Ready to Take Control?
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            Stop Paying for Subscriptions You{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
              Don't Use.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Join students and professionals optimizing their recurring cash flows with STArt today. Setup takes under 60 seconds.
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onDashboardClick}
              className="w-full sm:w-auto relative group overflow-hidden px-10 py-4.5 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/40 flex items-center justify-center gap-3"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch STArt Dashboard Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
