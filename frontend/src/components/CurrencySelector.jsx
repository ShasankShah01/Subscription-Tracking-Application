import React from 'react';
import { CURRENCY_SYMBOLS } from '../utils/currency';

export default function CurrencySelector({ currentCurrency, onChangeCurrency }) {
  return (
    <div className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
      <span className="text-cyan-400 font-bold">
        {CURRENCY_SYMBOLS[currentCurrency] || '$'}
      </span>
      <select
        value={currentCurrency}
        onChange={(e) => onChangeCurrency(e.target.value)}
        className="bg-transparent text-slate-200 focus:outline-none cursor-pointer font-bold uppercase"
        aria-label="Select display currency"
      >
        <option value="INR" className="bg-slate-900 text-white">INR (₹)</option>
        <option value="USD" className="bg-slate-900 text-white">USD ($)</option>
        <option value="EUR" className="bg-slate-900 text-white">EUR (€)</option>
        <option value="GBP" className="bg-slate-900 text-white">GBP (£)</option>
        <option value="CAD" className="bg-slate-900 text-white">CAD (C$)</option>
        <option value="AUD" className="bg-slate-900 text-white">AUD (A$)</option>
        <option value="JPY" className="bg-slate-900 text-white">JPY (¥)</option>
      </select>
    </div>
  );
}
