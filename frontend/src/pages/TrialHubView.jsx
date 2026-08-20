import React from 'react';
import { convertCurrency, formatPrice } from '../utils/currency';
import { apiFetch } from '../utils/api';

export default function TrialHubView({ subscriptions = [], setSubscriptions, displayCurrency = 'USD', displayToast }) {
  const trialSubs = (subscriptions || []).filter(s => s && s.status === 'Trial');

  const handleCancelTrial = async (id, name) => {
    const target = (subscriptions || []).find(sub => sub.id === id || sub._id === id);
    const mongoId = target?._id || target?.id || id;

    if (setSubscriptions) {
      setSubscriptions((subscriptions || []).map(sub =>
        (sub?.id === id || sub?._id === id)
          ? { ...sub, status: 'Paused', color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700' }
          : sub
      ));
    }
    displayToast?.(`Canceled free trial for ${name}`);

    if (mongoId) {
      await apiFetch(`/subscriptions/${mongoId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Paused' }),
      }).catch(err => console.error('Failed to cancel trial on backend:', err));
    }
  };

  const handleActivateTrial = async (id, name) => {
    const target = (subscriptions || []).find(sub => sub.id === id || sub._id === id);
    const mongoId = target?._id || target?.id || id;

    if (setSubscriptions) {
      setSubscriptions((subscriptions || []).map(sub =>
        (sub?.id === id || sub?._id === id)
          ? { ...sub, status: 'Active', color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' }
          : sub
      ));
    }
    displayToast?.(`Activated full subscription for ${name}`);

    if (mongoId) {
      await apiFetch(`/subscriptions/${mongoId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Active' }),
      }).catch(err => console.error('Failed to activate trial on backend:', err));
    }
  };

  const discoverTrials = [
    { name: 'Apple Music', duration: '1 Month Free', value: 10.99, category: 'Music' },
    { name: 'YouTube Premium', duration: '1 Month Free', value: 13.99, category: 'Entertainment' },
    { name: 'Canva Pro', duration: '30 Days Free', value: 14.99, category: 'Design' },
    { name: 'Dashlane', duration: '30 Days Free', value: 3.33, category: 'Security' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">

      {/* ── Trial Tracking Section ─────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-purple-100 dark:bg-royal-purple-500/10 text-royal-purple-700 dark:text-royal-purple-400 text-xs font-bold border border-royal-purple-200 dark:border-royal-purple-500/20 mb-3">
            Active Trials
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Free Trials
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and cancel trials before they convert into paid subscriptions.
          </p>
        </div>

        {trialSubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trialSubs.map(sub => {
              const priceStr = String(sub?.price || '0');
              const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
              const convertedVal = convertCurrency(rawVal, sub?.currency || 'USD', displayCurrency);

              return (
                <div
                  key={sub.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-royal-purple-200 dark:border-royal-purple-500/30 backdrop-blur-xl relative overflow-hidden shadow-lg card-hover group"
                >
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-royal-purple-100 dark:bg-royal-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-royal-purple-50 dark:bg-slate-950 border border-royal-purple-200 dark:border-royal-purple-500/40 text-royal-purple-700 dark:text-royal-purple-400 flex items-center justify-center font-bold text-sm">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sub.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                          {sub.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {formatPrice(convertedVal, displayCurrency)}/mo
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">after trial</div>
                    </div>
                  </div>

                  <div className="mb-5 relative z-10">
                    <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/20 inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ends {sub.renewal}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    <button
                      onClick={() => handleCancelTrial(sub.id, sub.name)}
                      className="py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 rounded-xl transition-colors"
                    >
                      Cancel Trial
                    </button>
                    <button
                      onClick={() => handleActivateTrial(sub.id, sub.name)}
                      className="py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl transition-colors"
                    >
                      Keep Active
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed bg-slate-50 dark:bg-slate-900/30 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">No Active Trials</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              You're not tracking any free trials. Add a subscription with 'Trial' status to track it here.
            </p>
          </div>
        )}
      </section>

      {/* ── Discover Section ───────────────────────────────────────────────── */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Discover Free Trials</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Popular services offering free trial periods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {discoverTrials.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-royal-purple-300 dark:hover:border-royal-purple-500/30 transition-all card-hover group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center text-sm shadow-inner group-hover:bg-royal-purple-100 dark:group-hover:bg-royal-purple-500/20 group-hover:text-royal-purple-700 dark:group-hover:text-royal-purple-400 transition-colors">
                  {item.name.charAt(0)}
                </div>
                <span className="text-[10px] font-bold text-gold-700 dark:text-gold-400 bg-gold-100 dark:bg-gold-500/10 px-2 py-0.5 rounded border border-gold-200 dark:border-gold-500/20">
                  {item.duration}
                </span>
              </div>
              <h5 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h5>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.category}</div>
              <div className="mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                Regular: {formatPrice(convertCurrency(item.value, 'USD', displayCurrency), displayCurrency)}/mo
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
