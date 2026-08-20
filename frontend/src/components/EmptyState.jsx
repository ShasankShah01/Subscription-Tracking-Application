import React from 'react';

export default function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative w-full max-w-lg p-10 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col items-center overflow-hidden">

        {/* Premium Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-royal-purple-100 dark:bg-royal-purple-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-200/40 dark:bg-gold-500/5 rounded-full blur-[60px] pointer-events-none" />

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-royal-purple-50 dark:bg-royal-purple-500/10 border border-royal-purple-200 dark:border-royal-purple-500/30 flex items-center justify-center mb-6 relative z-10 shadow-inner">
          <svg className="w-10 h-10 text-royal-purple-600 dark:text-royal-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3 relative z-10">
          No Subscriptions Yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm leading-relaxed relative z-10">
          Your dashboard is clean and ready. Add your first subscription to start tracking expenses, catching unused trials, and receiving renewal alerts.
        </p>

        {/* Gold Premium CTA */}
        <button
          onClick={onAdd}
          className="relative z-10 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-royal-purple-600 to-royal-purple-500 hover:from-royal-purple-500 hover:to-royal-purple-400 shadow-lg shadow-royal-purple-500/25 active:scale-95 transition-all flex items-center gap-2.5 group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Subscription
        </button>

        {/* Subtle hint */}
        <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 relative z-10">
          Track Netflix, Spotify, AWS, and more — all in one premium view.
        </p>
      </div>
    </div>
  );
}
