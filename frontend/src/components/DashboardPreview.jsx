import React, { useState } from 'react';

const mockSubscriptions = [
  { id: 1, name: 'Netflix Premium', category: 'Entertainment', price: '$19.99', cycle: 'Monthly', status: 'Active', renewal: 'Aug 18, 2026', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 2, name: 'Spotify Student', category: 'Music', price: '$5.99', cycle: 'Monthly', status: 'Active', renewal: 'Aug 22, 2026', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 3, name: 'AWS Cloud Hosting', category: 'Infrastructure', price: '$42.50', cycle: 'Monthly', status: 'Upcoming', renewal: 'Aug 16, 2026', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 4, name: 'Figma Professional', category: 'Design', price: '$15.00', cycle: 'Monthly', status: 'Active', renewal: 'Sep 01, 2026', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 5, name: 'ChatGPT Plus', category: 'AI Tools', price: '$20.00', cycle: 'Monthly', status: 'Active', renewal: 'Sep 05, 2026', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { id: 6, name: 'Gym Membership', category: 'Fitness', price: '$65.00', cycle: 'Monthly', status: 'Waste Flagged', renewal: 'Aug 29, 2026', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
];

export default function DashboardPreview({ onDashboardClick }) {
  const [activeTab, setActiveTab] = useState('overview');
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
            ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30'
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        };
      }
      return sub;
    }));
  };

  const filteredSubs = filter === 'All'
    ? subs
    : filter === 'Flagged'
    ? subs.filter(s => s.status.includes('Flagged') || s.status.includes('Upcoming'))
    : subs.filter(s => s.category === filter);

  return (
    <section id="dashboard-preview" className="py-24 border-b border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            Interactive Product Preview
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            A Live Look Inside the{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              STArt Dashboard
            </span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Experience the clean glassmorphic UI designed for instant subscription control, expense breakdown, and automated renewal tracking.
          </p>
        </div>

        {/* Dashboard Glassmorphic Window Mockup */}
        <div className="relative rounded-3xl bg-zinc-950/80 border border-white/10 shadow-[0_0_80px_-15px_rgba(99,102,241,0.25)] backdrop-blur-2xl overflow-hidden">
          
          {/* Mac-style Window Titlebar */}
          <div className="px-6 py-4 bg-zinc-900/90 border-b border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-400/30" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-400/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-400/30" />
              <span className="ml-4 text-xs font-mono text-zinc-500 hidden sm:inline-block">app.start-subscriptions.io/dashboard</span>
            </div>

            {/* Window Tabs */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Launch App Trigger */}
            <button
              onClick={onDashboardClick}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors flex items-center gap-1.5"
            >
              <span>Full Screen</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>

          {/* Dashboard Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Top Stat Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Total Monthly Spend</div>
                <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                  $168.48
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    -$24 vs last mo
                  </span>
                </div>
                <div className="mt-3 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-[65%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-violet-500/30 transition-all">
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Active Services</div>
                <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                  6 Subscriptions
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    MERN Synced
                  </span>
                </div>
                <div className="mt-3 w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-full w-[80%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Next Auto-Renewal</div>
                <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
                  AWS Cloud
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    3 Days
                  </span>
                </div>
                <div className="mt-3 text-xs text-zinc-500 font-medium">Estimated charge: $42.50</div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Unused Sub Waste</div>
                <div className="text-3xl font-black text-rose-400 mt-2 flex items-baseline gap-2">
                  $65.00/mo
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    Action Needed
                  </span>
                </div>
                <div className="mt-3 text-xs text-zinc-400 font-medium">Flagged: Gym Membership (0 checkins)</div>
              </div>
            </div>

            {/* Filter & Subscriptions Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Active Subscription Inventory</h3>
                  <p className="text-xs text-zinc-400">Click any status toggle to simulate real-time pausing or status updates.</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
                  {['All', 'Entertainment', 'Infrastructure', 'Flagged'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        filter === cat
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscriptions List */}
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/30 backdrop-blur-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="text-xs font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/80 border-b border-white/10">
                      <tr>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price / Billing</th>
                        <th className="px-6 py-4">Next Renewal</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {filteredSubs.map((sub) => (
                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                                {sub.name.charAt(0)}
                              </div>
                              <span className="font-bold text-white">{sub.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-400">{sub.category}</td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-white">{sub.price}</span>
                            <span className="text-xs text-zinc-500"> / {sub.cycle}</span>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-300">{sub.renewal}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${sub.color}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => toggleStatus(sub.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors"
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
