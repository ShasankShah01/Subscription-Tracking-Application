import React, { useState } from 'react';

export default function PricingSection({ onDashboardClick }) {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 border-b border-white/5 relative overflow-hidden">
      {/* Background glow sphere */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400 mb-4">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Simple Plans for Every Subscription Need
          </h2>
          <p className="text-zinc-400 text-lg">
            Start completely free for college projects or upgrade for unlimited automated alerts and family sharing.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-zinc-900 border border-white/10">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                !annual ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                annual ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-zinc-950">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Plan 1: Free Student */}
          <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Student Edition</div>
              <h3 className="text-2xl font-black text-white mb-2">Starter Free</h3>
              <p className="text-zinc-400 text-xs mb-6">Essential subscription tracking for students and budget-conscious individuals.</p>
              <div className="text-4xl font-black text-white mb-6">
                $0 <span className="text-xs font-normal text-zinc-500">/ forever</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Track up to 10 active subscriptions
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Manual renewal date alerts
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Basic category spending breakdown
                </li>
                <li className="flex items-center gap-2 text-zinc-500">
                  <svg className="w-4 h-4 text-zinc-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Automated email/SMS alerts
                </li>
              </ul>
            </div>
            <button
              onClick={onDashboardClick}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors"
            >
              Get Free Starter
            </button>
          </div>

          {/* Plan 2: Pro Tracker (Featured) */}
          <div className="relative rounded-3xl bg-zinc-900/80 border-2 border-indigo-500 p-8 backdrop-blur-2xl flex flex-col justify-between shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)] scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
              Most Popular Choice
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Full Automation</div>
              <h3 className="text-2xl font-black text-white mb-2">Pro Tracker</h3>
              <p className="text-zinc-400 text-xs mb-6">Complete automation, unlimited tracking, and instant waste alerts.</p>
              <div className="text-4xl font-black text-white mb-6">
                {annual ? '$3.99' : '$4.99'}{' '}
                <span className="text-xs font-normal text-zinc-400">/ month {annual ? '(billed annually)' : ''}</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-200 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  <strong>Unlimited</strong> subscription tracking
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Proactive Email & WhatsApp alerts
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Automated Waste & Trial Flagging
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Multi-Currency Conversion
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  MERN Cloud Sync & Backup
                </li>
              </ul>
            </div>
            <button
              onClick={onDashboardClick}
              className="w-full py-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all border border-indigo-400/30"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Plan 3: Team / Household */}
          <div className="rounded-3xl bg-zinc-900/40 border border-white/10 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Shared Expenses</div>
              <h3 className="text-2xl font-black text-white mb-2">Household & Team</h3>
              <p className="text-zinc-400 text-xs mb-6">Split subscription costs with roommates, family, or co-founders.</p>
              <div className="text-4xl font-black text-white mb-6">
                {annual ? '$7.99' : '$9.99'}{' '}
                <span className="text-xs font-normal text-zinc-500">/ month</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300 mb-8 font-medium">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Everything in Pro Plan
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Up to 5 shared user seats
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Split billing & cost allocation
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  Export CSV & PDF financial reports
                </li>
              </ul>
            </div>
            <button
              onClick={onDashboardClick}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-colors"
            >
              Get Team Plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
