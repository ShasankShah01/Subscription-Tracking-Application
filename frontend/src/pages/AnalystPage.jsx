import React from 'react';

export default function AnalystPage({ user }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-white">System Analyst Dashboard</h2>
        <p className="text-sm text-slate-400">Read-only view of platform metrics and system health.</p>
      </div>

      {/* Platform Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Registered Users</div>
          <div className="text-3xl font-black text-white mt-2">142 Accounts</div>
          <div className="mt-3 text-xs text-emerald-400 font-medium">+18 this week</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Platform Subscriptions</div>
          <div className="text-3xl font-black text-cyan-400 mt-2">524 Entries</div>
          <div className="mt-3 text-xs text-slate-500 font-medium">84% active status</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Tracked Volume</div>
          <div className="text-3xl font-black text-purple-400 mt-2">$14,850 / mo</div>
          <div className="mt-3 text-xs text-slate-500 font-medium">Platform-wide aggregate</div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">System Health & Engine</div>
          <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
            Optimal
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              100% Uptime
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">MERN Express & Mongo API</div>
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-slate-800 border-dashed bg-slate-900/30 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h4 className="font-bold text-white mb-1">Restricted Access</h4>
        <p className="text-xs text-slate-500 max-w-sm">As a System Analyst, you have read-only access to platform metrics. User management and RBAC updates are restricted to Administrators.</p>
      </div>
    </div>
  );
}
