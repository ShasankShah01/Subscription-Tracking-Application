import React from 'react';

export default function BentoFeatures() {
  return (
    <section id="features" className="py-24 border-b border-slate-800/60 relative overflow-hidden">
      {/* Aurora Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-teal-500/15 to-violet-600/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            Bento Box Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Designed for Instant Visibility & Control
          </h2>
          <p className="text-slate-400 text-lg">
            STArt combines intelligent automated tracking, multi-currency conversion, and proactive alerts in an asymmetrical bento grid.
          </p>
        </div>

        {/* Bento Box Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Card 1: Large Featured Card (Spans 8 columns) */}
          <div className="md:col-span-8 rounded-3xl bg-slate-900/60 border border-slate-800 p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                ⚡ Proactive Alert Engine
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Automated Renewal Reminders & Deadline Tracking
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Never get surprised by auto-renewals again. STArt monitors your due dates and alerts you before charges hit your bank account.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-500">Alert Accuracy</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-cyan-400">0$</div>
                <div className="text-[10px] text-slate-500">Hidden Charges</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-xl font-black text-white">Instant</div>
                <div className="text-[10px] text-slate-500">MERN Sync</div>
              </div>
            </div>
          </div>

          {/* Card 2: Tall Accent Card (Spans 4 columns) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                🌍 Global Engine
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Auto Currency & Country Localization
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Select your country during signup and STArt automatically configures your display currency (INR ₹, USD $, EUR €, GBP £, CAD $, AUD $, JPY ¥). Override anytime with live rates.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>India (INR)</span>
                <span className="text-emerald-400 font-bold">₹83.50 / $</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Eurozone (EUR)</span>
                <span className="text-cyan-400 font-bold">€0.92 / $</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>UK (GBP)</span>
                <span className="text-purple-400 font-bold">£0.78 / $</span>
              </div>
            </div>
          </div>

          {/* Card 3: Medium Card (Spans 4 columns) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/40 transition-all shadow-2xl">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                🛡️ Waste Guard
              </span>
              <h3 className="text-xl font-bold text-white">Unused Subscription Flagging</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Identify inactive memberships and free trial deadlines before money leaks from your pocket.
              </p>
            </div>
          </div>

          {/* Card 4: Medium Card (Spans 4 columns) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-2xl">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                👑 RBAC Security
              </span>
              <h3 className="text-xl font-bold text-white">Role-Based Access Control</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Three system roles (User, System Analyst, Admin) with dedicated platform analytics and user management.
              </p>
            </div>
          </div>

          {/* Card 5: Medium Card (Spans 4 columns) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-2xl">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                📱 PWA Installable
              </span>
              <h3 className="text-xl font-bold text-white">Progressive Web App</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Install STArt on desktop or mobile with standalone display settings and service worker asset caching.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
