import React, { useState } from 'react';

export default function SavingsCalculator({ onDashboardClick }) {
  const [subCount, setSubCount] = useState(8);
  const [avgCost, setAvgCost] = useState(24);
  const [wasteRatio, setWasteRatio] = useState(25);

  const totalMonthly = subCount * avgCost;
  const monthlySavings = Math.round(totalMonthly * (wasteRatio / 100));
  const annualSavings = monthlySavings * 12;

  return (
    <section id="calculator" className="py-24 border-b border-white/5 relative overflow-hidden">
      {/* Glow background sphere */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-4">
            Interactive Financial ROI Tool
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            How Much Money Are You{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Leaking Each Year?
            </span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Adjust the sliders below to estimate how much cash you can reclaim by eliminating forgotten subscriptions and auto-renewal traps.
          </p>
        </div>

        {/* Glassmorphic Calculator Container */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-zinc-900/60 border border-white/10 p-8 sm:p-12 backdrop-blur-xl shadow-2xl grid md:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column (7 cols) */}
          <div className="md:col-span-7 space-y-8">
            
            {/* Slider 1: Subscription Count */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <label className="font-bold text-white">Active Subscriptions</label>
                <span className="font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                  {subCount} services
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                value={subCount}
                onChange={(e) => setSubCount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-semibold">
                <span>2 subs</span>
                <span>12 subs</span>
                <span>25+ subs</span>
              </div>
            </div>

            {/* Slider 2: Average Monthly Cost */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <label className="font-bold text-white">Avg. Cost per Subscription</label>
                <span className="font-black text-violet-400 bg-violet-500/10 px-3 py-1 rounded-xl border border-violet-500/20">
                  ${avgCost} / mo
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={avgCost}
                onChange={(e) => setAvgCost(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-semibold">
                <span>$5</span>
                <span>$50</span>
                <span>$100+</span>
              </div>
            </div>

            {/* Slider 3: Unused Sub Ratio */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <label className="font-bold text-white">Estimated Unused / Forgotten Subscriptions</label>
                <span className="font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  {wasteRatio}% waste
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={wasteRatio}
                onChange={(e) => setWasteRatio(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-semibold">
                <span>5% (Minimal)</span>
                <span>25% (Average)</span>
                <span>50% (High Leakage)</span>
              </div>
            </div>
          </div>

          {/* Results Column (5 cols) */}
          <div className="md:col-span-5 rounded-2xl bg-zinc-950 p-6 sm:p-8 border border-white/10 flex flex-col justify-between text-center relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <div className="text-xs uppercase font-bold tracking-wider text-zinc-400">Total Monthly Spend</div>
                <div className="text-2xl font-black text-white mt-1">${totalMonthly} / mo</div>
              </div>

              <div className="border-b border-white/10 pb-4">
                <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">Monthly Recoverable Cash</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">${monthlySavings} / mo</div>
              </div>

              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-zinc-400">Estimated Annual Savings</div>
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent mt-2">
                  ${annualSavings.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1">per year back in your pocket</div>
              </div>
            </div>

            <button
              onClick={onDashboardClick}
              className="mt-8 w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/30"
            >
              Reclaim ${annualSavings.toLocaleString()} with STArt
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
