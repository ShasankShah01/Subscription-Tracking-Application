import React, { useState, useEffect } from 'react';

const getCurrencySymbol = (currency) => {
  if (currency === 'USD') return '$';
  if (currency === 'EUR') return '€';
  if (currency === 'GBP') return '£';
  if (currency === 'INR') return '₹';
  if (currency === 'JPY') return '¥';
  if (currency === 'AUD') return 'A$';
  if (currency === 'CAD') return 'C$';
  return '$';
};

export default function AddSubscriptionModal({ isOpen, onClose, onSave, initialData, displayCurrency = 'USD' }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState('Monthly');
  const [renewal, setRenewal] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setPrice(initialData.price.replace(/[^0-9.]/g, ''));
      setCycle(initialData.cycle);
      setRenewal(initialData.renewal);
      setStatus(initialData.status);
    } else {
      setName('');
      setCategory('Entertainment');
      setPrice('');
      setCycle('Monthly');
      setRenewal('');
      setStatus('Active');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const formattedPrice = price.startsWith('$') ? price : `$${price}`;
    
    let color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (status === 'Paused') color = 'bg-slate-800 text-slate-400 border-slate-700';
    if (status === 'Trial') color = 'bg-purple-500/10 text-purple-400 border-purple-500/20';

    onSave({
      name,
      category,
      price: formattedPrice,
      currency: initialData ? initialData.currency : 'USD',
      cycle,
      status,
      renewal: renewal || 'Next Month',
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Glow ambient background sphere */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? 'Edit Subscription' : 'Add New Subscription'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub Copilot, Spotify, AWS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Design">Design</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Music">Music</option>
                <option value="Fitness">Fitness</option>
                <option value="Utilities">Utilities</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
                Cost / Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">
                  {getCurrencySymbol(displayCurrency)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="14.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
                Billing Cycle
              </label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Trial">Trial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider mb-1">
              Next Renewal Date
            </label>
            <input
              type="date"
              value={renewal}
              onChange={(e) => setRenewal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20 transition-all"
            >
              {initialData ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
