import React, { useState, useEffect } from 'react';

export default function WelcomeModal({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  const getStorageKey = () => {
    const userIdentifier = user?._id || user?.id || user?.email || 'guest';
    return `hasSeenWelcome_${userIdentifier}`;
  };

  useEffect(() => {
    try {
      const userIdentifier = user?._id || user?.id || user?.email || 'guest';
      const storageKey = `hasSeenWelcome_${userIdentifier}`;
      const hasSeen = localStorage.getItem(storageKey);
      if (hasSeen !== 'true') {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      console.warn('localStorage read error in WelcomeModal:', err);
    }
  }, [user]);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, 'true');
    } catch (err) {
      console.warn('localStorage write error in WelcomeModal:', err);
    }
  };

  if (!isOpen) return null;

  const userName = user?.name || 'Explorer';
  const userRole = user?.role || 'Member';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onMouseDown={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}
    >
      {/* Clean Dual-Theme Modal Card */}
      <div className="bg-white dark:bg-[#050505] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Subtle Ambient Glow (Dark Mode) */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close "X" Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close welcome modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Container */}
        <div className="relative z-10">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold mb-4 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400" />
            STArt Dashboard • {userRole}
          </div>

          {/* Clean Primary Header */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome, {userName}!
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Your recurring subscription command center is ready. Track spending, predict renewal dates, and convert currencies seamlessly.
          </p>

          {/* Highlights List */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                ⚡
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">Real-Time Metrics</span>
                <span className="text-slate-500 dark:text-slate-400">Live spend analytics across top 20 world currencies.</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                📅
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">Drop-Up Date Picker</span>
                <span className="text-slate-500 dark:text-slate-400">Accurate renewal dates with clean viewport clearance.</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3.5 px-6 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <span>Explore Workspace</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
