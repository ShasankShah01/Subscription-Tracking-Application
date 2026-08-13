import React, { useState } from 'react';

const mockSubscriptions = [
  { id: 1, name: 'Netflix Premium', category: 'Entertainment', price: '$19.99', cycle: 'Monthly', status: 'Active', renewal: 'Aug 18, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 2, name: 'Spotify Student', category: 'Music', price: '$5.99', cycle: 'Monthly', status: 'Active', renewal: 'Aug 22, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 3, name: 'AWS Cloud Hosting', category: 'Infrastructure', price: '$42.50', cycle: 'Monthly', status: 'Upcoming', renewal: 'Aug 16, 2026', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  { id: 4, name: 'Figma Professional', category: 'Design', price: '$15.00', cycle: 'Monthly', status: 'Active', renewal: 'Sep 01, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 5, name: 'ChatGPT Plus', category: 'AI Tools', price: '$20.00', cycle: 'Monthly', status: 'Active', renewal: 'Sep 05, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 6, name: 'Gym Membership', category: 'Fitness', price: '$65.00', cycle: 'Monthly', status: 'Flagged Waste', renewal: 'Aug 29, 2026', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
];

export default function DashboardPreview({ onDashboardClick }) {
  const [subs, setSubs] = useState(mockSubscriptions);
  const [filter, setFilter] = useState('All');

  const toggleStatus = (id) => {
    setSubs(subs.map(sub => {
      if (sub.id === id) {
        const newStatus = sub.status === 'Paused' ? 'Active' : 'Paused';
        return {
          ...sub,
          status: newStatus,
          color: newStatus === 'Paused'
            ? 'bg-slate-800 text-slate-400 border-slate-700'
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        };
      }
      return sub;
    }));
  };

  const filteredSubs = filter === 'All'
    ? subs
    : subs.filter(s => s.category === filter || s.status.includes(filter));

  return (
    <section id="dashboard-preview" className="py-24 border-b border-slate-800/60 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            Interactive Product Preview
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Inside the STArt Workspace
          </h2>
          <p className="text-slate-400 text-lg">
            Experience the clean glassmorphic UI designed for instant subscription control, expense breakdown, and automated renewal tracking.
          </p>
        </div>

        {/* Dashboard Glassmorphic Window Mockup */}
        <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-2xl overflow-hidden">
          
          {/* Mac Window Titlebar */}
          <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-4 text-xs font-mono text-slate-500 hidden sm:inline-block">app.start-subscriptions.io/workspace</span>
            </div>

            {/* Launch Full Working Workspace Button */}
            <button
              onClick={onDashboardClick}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Launch Full Interactive Dashboard</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Dashboard Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Stat Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-xl">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Monthly Spend</div>
                <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                  $168.48
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Live
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-xl">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Services</div>
                <div className="text-3xl font-black text-emerald-400 mt-2 flex items-baseline gap-2">
                  6 Subscriptions
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-xl">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Next Auto-Renewal</div>
                <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                  AWS Cloud
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    3 Days
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 backdrop-blur-xl">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Unused Sub Waste</div>
                <div className="text-3xl font-black text-rose-400 mt-2 flex items-baseline gap-2">
                  $65.00/mo
                </div>
              </div>
            </div>

            {/* Filter Pills & Interactive Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Active Subscriptions</h3>
                  <p className="text-xs text-slate-400">Click Pause/Resume below to test local state updates.</p>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
                  {['All', 'Entertainment', 'Infrastructure', 'Flagged'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        filter === cat
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscriptions Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/50 backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price / Billing</th>
                        <th className="px-6 py-4">Next Renewal</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-medium">
                      {filteredSubs.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                                {sub.name.charAt(0)}
                              </div>
                              <span className="font-bold text-white">{sub.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">{sub.category}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-white">{sub.price}</span>
                            <span className="text-xs text-slate-500"> / {sub.cycle}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-300">{sub.renewal}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${sub.color}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => toggleStatus(sub.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                            >
                              {sub.status === 'Paused' ? 'Resume' : 'Pause'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
