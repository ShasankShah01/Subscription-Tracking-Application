import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ user, onFeedbackClick }) {
  const getNavItems = () => {
    const role = user?.role || 'User';

    if (role === 'Admin') {
      return [
        { name: 'User Management', path: '/admin-dashboard', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )},
      ];
    }

    if (role === 'System Analyst') {
      return [
        { name: 'System Logs', path: '/analyst-dashboard', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )},
      ];
    }

    return [
      { name: 'Dashboard', path: '/dashboard', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )},
      { name: 'Analytics', path: '/dashboard/analytics', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )},
      { name: 'Trial Hub', path: '/dashboard/trial-hub', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )},
      { name: 'Settings', path: '/dashboard/settings', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )},
    ];
  };

  const navItems = getNavItems();
  const role = user?.role || 'User';
  const showFeedback = role === 'User' || role === 'System Analyst';

  return (
    <div className="w-64 bg-white dark:bg-[#0B1120] border-r border-slate-200 dark:border-white/5 flex flex-col h-screen fixed left-0 top-0 transition-colors">

      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-royal-purple-600 to-royal-purple-400 flex items-center justify-center font-black text-xl text-white shadow-md shadow-royal-purple-500/30">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
            ST<span className="text-royal-purple-600 dark:text-royal-purple-400">Art</span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">
          Workspace
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard' || item.path === '/admin-dashboard' || item.path === '/analyst-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-royal-purple-50 dark:bg-royal-purple-500/10 text-royal-purple-700 dark:text-royal-purple-300 border border-royal-purple-200 dark:border-royal-purple-500/20 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:-translate-y-0.5'
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

        {/* Feedback Button — authenticated users only */}
        {showFeedback && onFeedbackClick && (
          <>
            <div className="h-px bg-slate-200 dark:bg-white/5 my-3" />
            <button
              onClick={onFeedbackClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:-translate-y-0.5 transition-all duration-150 text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Feedback
            </button>
          </>
        )}
      </nav>

      {/* Version Badge */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-royal-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">STArt Tracker</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-3">100% Free Forever</p>
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 text-[10px] font-bold text-royal-purple-600 dark:text-royal-purple-400 border border-royal-purple-200 dark:border-royal-purple-500/20">
            V1.0 Stable
          </div>
        </div>
      </div>
    </div>
  );
}
