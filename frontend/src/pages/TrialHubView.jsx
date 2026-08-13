import React from 'react';
import { convertCurrency, formatPrice } from '../utils/currency';

export default function TrialHubView({ subscriptions, setSubscriptions, displayCurrency, displayToast }) {
  const trialSubs = subscriptions.filter(s => s.status === 'Trial');

  const handleCancelTrial = (id, name) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: 'Paused', color: 'bg-slate-800 text-slate-400 border-slate-700' } : sub
    ));
    displayToast(`Canceled free trial for ${name}`);
  };

  const handleActivateTrial = (id, name) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, status: 'Active', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' } : sub
    ));
    displayToast(`Activated full subscription for ${name}`);
  };

  const discoverTrials = [
    { name: 'Apple Music', duration: '1 Month Free', value: 10.99, category: 'Music' },
    { name: 'YouTube Premium', duration: '1 Month Free', value: 13.99, category: 'Entertainment' },
    { name: 'Canva Pro', duration: '30 Days Free', value: 14.99, category: 'Design' },
    { name: 'Dashlane', duration: '30 Days Free', value: 3.33, category: 'Security' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Trial Tracking Section */}
      <section>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20 mb-3">
            Active Trials
          </div>
          <h2 className="text-2xl font-black text-white">Your Free Trials</h2>
          <p className="text-sm text-slate-400">Track and cancel trials before they convert into paid subscriptions.</p>
        </div>

        {trialSubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trialSubs.map(sub => {
              const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
              const convertedVal = convertCurrency(rawVal, sub.currency || 'USD', displayCurrency);

              return (
                <div key={sub.id} className="p-5 rounded-3xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-xl relative overflow-hidden shadow-lg group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{sub.name}</h4>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{sub.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{formatPrice(convertedVal, displayCurrency)}/mo</div>
                      <div className="text-[10px] text-slate-500">after trial</div>
                    </div>
                  </div>

                  <div className="mb-5 relative z-10">
                    <div className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20 inline-flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Ends {sub.renewal}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    <button 
                      onClick={() => handleCancelTrial(sub.id, sub.name)}
                      className="py-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-colors"
                    >
                      Cancel Trial
                    </button>
                    <button 
                      onClick={() => handleActivateTrial(sub.id, sub.name)}
                      className="py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors"
                    >
                      Keep Active
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl border border-slate-800 border-dashed bg-slate-900/30 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h4 className="font-bold text-white mb-1">No Active Trials</h4>
            <p className="text-xs text-slate-500 max-w-sm">You are currently not tracking any free trials. Add a new subscription and mark its status as 'Trial' to track it here.</p>
          </div>
        )}
      </section>

      {/* Discover Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Discover Free Trials</h2>
          <p className="text-sm text-slate-400">Popular services offering free trial periods.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {discoverTrials.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-inner group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                  {item.name.charAt(0)}
                </div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {item.duration}
                </span>
              </div>
              <h5 className="font-bold text-white text-sm">{item.name}</h5>
              <div className="text-xs text-slate-500 mt-1">{item.category}</div>
              <div className="mt-4 text-xs font-semibold text-slate-400">
                Regular: {formatPrice(convertCurrency(item.value, 'USD', displayCurrency), displayCurrency)}/mo
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
