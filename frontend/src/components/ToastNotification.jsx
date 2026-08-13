import React from 'react';

export default function ToastNotification({ onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-indigo-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl max-w-md flex items-center gap-4 group">
        {/* Ambient glow accent inside toast */}
        <div className="absolute -left-10 -top-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
        
        {/* Animated spinner/icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>

        {/* Text details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-white tracking-wide">Launching STArt Dashboard</h4>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Demo
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 truncate">
            Syncing MERN database, recurring metrics & active subscriptions...
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
