import React from 'react';

export default function ToastNotification({ message, onClose }) {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/30 p-4 sm:p-5 shadow-2xl dark:backdrop-blur-xl max-w-md flex items-center gap-4 group transition-colors">
        <div className="absolute -left-10 -top-10 w-24 h-24 bg-cyan-100 dark:bg-cyan-500/20 rounded-full blur-xl pointer-events-none transition-colors" />

        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-white dark:text-slate-950 shrink-0 shadow-lg shadow-cyan-500/20 font-black">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white tracking-wide">STArt Notification</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {message || 'Action completed successfully.'}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
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
