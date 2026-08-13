import React from 'react';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    badge: 'Proactive Alerting',
    title: 'Smart Renewal Reminders',
    description: 'Never get hit with unexpected auto-renewals again. Receive automated heads-up notifications before money leaves your account.',
    accent: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    badge: 'Visual Cash Flow',
    title: 'Categorized Expense Analytics',
    description: 'Breakdown your monthly burn rate into clear categories—Streaming, SaaS, Cloud Infrastructure, and Fitness memberships.',
    accent: 'from-emerald-500 to-teal-500',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    badge: 'Waste Detection',
    title: 'Unused Subscription Guard',
    description: 'Flag under-utilized subscriptions and free trial deadlines, giving you actionable recommendations to save money.',
    accent: 'from-rose-500 to-pink-500',
    iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    badge: 'Global Currency',
    title: 'Multi-Currency Conversion',
    description: 'Track global developer tools or overseas subscriptions with real-time automatic currency normalization to your base currency.',
    accent: 'from-amber-500 to-orange-500',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    ),
    badge: 'Effortless Opt-Out',
    title: 'One-Click Cancellation Playbook',
    description: 'Get direct cancellation links and step-by-step guidance for tricky recurring subscription services that hide their unsubscribe buttons.',
    accent: 'from-cyan-500 to-blue-500',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
    badge: 'High-Performance',
    title: 'MERN Stack Enterprise Core',
    description: 'Engineered with MongoDB, Express, React 19, and Node.js for lightning-fast sub-millisecond query responses and rock-solid security.',
    accent: 'from-cyan-400 to-emerald-400',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 border-b border-slate-800/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            Engineered for Maximum Control
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Built to Eliminate Subscription Leakage
          </h2>
          <p className="text-slate-400 text-lg">
            STArt combines intelligent tracking, proactive alerts, and financial visibility into a single glassmorphic workspace.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-slate-900/60 border border-slate-800 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 shadow-xl"
            >
              {/* Icon badge */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                  {item.badge}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                {item.description}
              </p>

              {/* Accent Line */}
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div className={`h-full w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${item.accent}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
