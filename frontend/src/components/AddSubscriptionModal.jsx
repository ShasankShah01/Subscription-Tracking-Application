import React, { useState, useEffect, useRef } from 'react';
import CustomDatePicker from './CustomDatePicker';
import { CURRENCY_SYMBOLS } from '../utils/currency';

const STANDARD_CATEGORIES = [
  'Entertainment',
  'Cloud & Hosting',
  'Developer Tools',
  'Domains & DNS',
  'AI Tools',
  'Infrastructure',
  'Design',
  'Productivity & SaaS',
  'Music',
  'Fitness',
  'Utilities',
];

// World's Top 20 Currencies
const TOP_20_CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'JPY', symbol: '¥' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'CHF', symbol: 'CHF' },
  { code: 'CNY', symbol: '¥' },
  { code: 'HKD', symbol: 'HK$' },
  { code: 'NZD', symbol: 'NZ$' },
  { code: 'SEK', symbol: 'kr' },
  { code: 'KRW', symbol: '₩' },
  { code: 'SGD', symbol: 'S$' },
  { code: 'NOK', symbol: 'kr' },
  { code: 'MXN', symbol: 'Mex$' },
  { code: 'ZAR', symbol: 'R' },
  { code: 'TRY', symbol: '₺' },
  { code: 'BRL', symbol: 'R$' },
  { code: 'AED', symbol: 'AED' },
];

const BILLING_CYCLES = ['Monthly', 'Yearly'];
const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active', badge: 'bg-emerald-500/20 text-emerald-400' },
  { value: 'Paused', label: 'Paused', badge: 'bg-slate-500/20 text-slate-400' },
  { value: 'Trial', label: 'Trial', badge: 'bg-purple-500/20 text-purple-400' },
];

export default function AddSubscriptionModal({
  isOpen,
  onClose,
  onAdd,
  onSave,
  onSubmit,
  initialData = null,
  displayCurrency = 'USD',
  draftData = null,
  onUpdateDraft = null,
  onClearDraft = null,
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Entertainment');
  const [customCategory, setCustomCategory] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState('Monthly');
  const [isCycleOpen, setIsCycleOpen] = useState(false);
  const [renewal, setRenewal] = useState('');
  const [status, setStatus] = useState('Active');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const currencyDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const cycleDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Close any open custom dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(e.target)) {
        setIsCurrencyOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
      }
      if (cycleDropdownRef.current && !cycleDropdownRef.current.contains(e.target)) {
        setIsCycleOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
        setIsStatusOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCurrencyOpen(false);
        setIsCategoryOpen(false);
        setIsCycleOpen(false);
        setIsStatusOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setFormError('');
    if (initialData) {
      setName(initialData.name || '');
      
      const isStandard = STANDARD_CATEGORIES.includes(initialData.category);
      if (isStandard) {
        setCategory(initialData.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(initialData.category || '');
      }

      setCurrency(initialData.currency || displayCurrency || 'USD');
      setPrice(initialData.price ? String(initialData.price).replace(/[^0-9.]/g, '') : (initialData.cost ? String(initialData.cost) : ''));
      setCycle(initialData.cycle || initialData.billingCycle || 'Monthly');
      setRenewal(initialData.renewal || initialData.nextRenewalDate || '');
      setStatus(initialData.status || 'Active');
    } else if (draftData) {
      setName(draftData.name || '');
      setCategory(draftData.category || 'Entertainment');
      setCustomCategory(draftData.customCategory || '');
      setCurrency(draftData.currency || displayCurrency || 'USD');
      setPrice(draftData.price || '');
      setCycle(draftData.cycle || 'Monthly');
      setRenewal(draftData.renewal || '');
      setStatus(draftData.status || 'Active');
    } else if (!draftData && isOpen) {
      setCurrency(displayCurrency || 'USD');
    }
    setIsCurrencyOpen(false);
    setIsCategoryOpen(false);
    setIsCycleOpen(false);
    setIsStatusOpen(false);
  }, [initialData, draftData, isOpen, displayCurrency]);

  const updateField = (field, value) => {
    if (field === 'name') setName(value);
    if (field === 'category') setCategory(value);
    if (field === 'customCategory') setCustomCategory(value);
    if (field === 'currency') setCurrency(value);
    if (field === 'price') setPrice(value);
    if (field === 'cycle') setCycle(value);
    if (field === 'renewal') setRenewal(value);
    if (field === 'status') setStatus(value);

    if (!initialData && onUpdateDraft) {
      onUpdateDraft({
        name: field === 'name' ? value : name,
        category: field === 'category' ? value : category,
        customCategory: field === 'customCategory' ? value : customCategory,
        currency: field === 'currency' ? value : currency,
        price: field === 'price' ? value : price,
        cycle: field === 'cycle' ? value : cycle,
        renewal: field === 'renewal' ? value : renewal,
        status: field === 'status' ? value : status,
      });
    }
  };

  const handleClear = () => {
    setName('');
    setCategory('Entertainment');
    setCustomCategory('');
    setCurrency(displayCurrency || 'USD');
    setPrice('');
    setCycle('Monthly');
    setRenewal('');
    setStatus('Active');
    setFormError('');
    if (onClearDraft) {
      onClearDraft();
    }
  };

  if (!isOpen) return null;

  const isCustom = category === 'Custom' || category === 'Custom...';
  const selectedCurrencyObj = TOP_20_CURRENCIES.find(c => c.code === currency) || { code: currency, symbol: CURRENCY_SYMBOLS[currency] || '$' };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }
    setFormError('');

    try {
      // 1. Sanitize payload safely
      const cleanName = String(name || '').trim() || 'Untitled';
      const numericCost = parseFloat(price) || 0;

      // Safely extract string currency
      const resolvedCurrency = typeof currency === 'object' && currency !== null
        ? String(currency.code || currency.value || 'USD').trim()
        : String(currency || 'USD').trim();

      // Safely extract string category
      let resolvedCategory = 'Entertainment';
      if (isCustom) {
        resolvedCategory = customCategory?.trim() || 'Custom';
      } else if (typeof category === 'object' && category !== null) {
        resolvedCategory = String(category.value || category.label || 'Entertainment').trim();
      } else {
        resolvedCategory = String(category || 'Entertainment').trim();
      }

      // Safely extract cycle and status strings
      const resolvedCycle = typeof cycle === 'object' && cycle !== null
        ? String(cycle.value || 'Monthly').trim()
        : String(cycle || 'Monthly').trim();

      const resolvedStatus = typeof status === 'object' && status !== null
        ? String(status.value || 'Active').trim()
        : String(status || 'Active').trim();

      const symbol = CURRENCY_SYMBOLS[resolvedCurrency] || '$';
      const formattedPrice = `${symbol}${numericCost.toFixed(2)}`;

      // Absolute date serialization to prevent React Date object render crash
      let sanitizedDate = new Date().toISOString();
      try {
        if (renewal) {
          sanitizedDate = typeof renewal?.toISOString === 'function'
            ? renewal.toISOString()
            : !isNaN(new Date(renewal).getTime())
              ? new Date(renewal).toISOString()
              : String(renewal).trim();
        }
      } catch {
        sanitizedDate = new Date().toISOString();
      }

      let color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      if (resolvedStatus === 'Paused') color = 'bg-slate-800 text-slate-400 border-slate-700';
      if (resolvedStatus === 'Trial') color = 'bg-purple-500/10 text-purple-400 border-purple-500/20';

      const payload = {
        name: cleanName,
        category: resolvedCategory,
        price: formattedPrice,
        cost: numericCost,
        currency: resolvedCurrency,
        cycle: resolvedCycle,
        billingCycle: resolvedCycle,
        status: resolvedStatus,
        renewal: sanitizedDate,
        nextRenewalDate: sanitizedDate,
        color,
      };

      // 2. Await submission prop safely
      const saveHandler = onSubmit || onSave || onAdd;
      if (typeof saveHandler === 'function') {
        await saveHandler(payload);
      }

      if (!initialData && onClearDraft) {
        onClearDraft();
      }

      if (typeof onClose === 'function') {
        onClose();
      }
    } catch (err) {
      console.error("SAFE CATCH - SUBMISSION ERROR:", err);
      setFormError(err?.message || "Failed to add subscription safely.");
    }
  };

  return (
    /* Modal Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Shell — glassmorphism */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-slate-200 dark:border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Glow ambient background sphere */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-500/10 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-[#F7E7CE] tracking-tight">
              {initialData ? 'Edit Subscription' : 'Add New Subscription'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {initialData ? 'Update recurring billing parameters' : 'Track recurring payments, renewal alerts & spend analytics'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-[#F7E7CE] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Error Banner */}
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold animate-in fade-in flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Subscription Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Subscription Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub Copilot, AWS, Spotify, DigitalOcean"
              value={name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 focus:border-transparent transition-all"
            />
          </div>

          {/* Category & Cost Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Custom Category Dropdown */}
            <div ref={categoryDropdownRef} className="relative">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsCurrencyOpen(false);
                  setIsCycleOpen(false);
                  setIsStatusOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isCategoryOpen}
              >
                <span className="font-medium text-xs sm:text-sm truncate">
                  {category === 'Custom' ? 'Custom...' : category}
                </span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-violet-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Custom Category Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full max-h-56 overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {STANDARD_CATEGORIES.map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          updateField('category', cat);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-violet-600 text-white font-bold shadow-sm'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                  
                  {/* Custom Option */}
                  <button
                    type="button"
                    onClick={() => {
                      updateField('category', 'Custom');
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 transition-colors ${
                      category === 'Custom'
                        ? 'bg-violet-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white'
                    }`}
                  >
                    <span>Custom...</span>
                    {category === 'Custom' && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              )}

              {/* Dynamic Animated Custom Category Input */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isCustom ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
                }`}
              >
                <input
                  type="text"
                  maxLength={30}
                  required={isCustom}
                  placeholder="Custom category name..."
                  value={customCategory}
                  onChange={(e) => updateField('customCategory', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-500/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                />
                <div className="flex justify-end pr-1 mt-0.5">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {customCategory.length}/30
                  </span>
                </div>
              </div>
            </div>

            {/* Cost / Price with Top 20 Currencies Sleek Dropdown Prefix */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Cost / Price
              </label>
              <div className="relative flex items-center rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 shadow-inner focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent transition-all">
                
                {/* Per-Subscription Currency Dropdown Prefix with max-h-48 scroll */}
                <div ref={currencyDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCurrencyOpen(!isCurrencyOpen);
                      setIsCategoryOpen(false);
                      setIsCycleOpen(false);
                      setIsStatusOpen(false);
                    }}
                    className="flex items-center gap-1.5 py-2.5 pl-3 pr-2.5 border-r border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors focus:outline-none cursor-pointer"
                    aria-label="Select currency"
                    aria-expanded={isCurrencyOpen}
                  >
                    <span>{selectedCurrencyObj.code} ({selectedCurrencyObj.symbol})</span>
                    <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180 text-violet-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu — top 20 currencies, max-h-48 with custom scroll */}
                  {isCurrencyOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-48 max-h-48 overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      {TOP_20_CURRENCIES.map((c) => {
                        const isSelected = c.code === currency;
                        return (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              updateField('currency', c.code);
                              setIsCurrencyOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-violet-600 text-white font-bold shadow-sm'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white'
                            }`}
                          >
                            <span>{c.code} ({c.symbol})</span>
                            {isSelected && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Input */}
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="14.99"
                  value={price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Billing Cycle & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Custom Billing Cycle Dropdown */}
            <div ref={cycleDropdownRef} className="relative">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Billing Cycle
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCycleOpen(!isCycleOpen);
                  setIsCategoryOpen(false);
                  setIsCurrencyOpen(false);
                  setIsStatusOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isCycleOpen}
              >
                <span className="font-medium text-xs sm:text-sm">{cycle}</span>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCycleOpen ? 'rotate-180 text-violet-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Billing Cycle Menu */}
              {isCycleOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {BILLING_CYCLES.map((c) => {
                    const isSelected = cycle === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          updateField('cycle', c);
                          setIsCycleOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-violet-600 text-white font-bold shadow-sm'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white'
                        }`}
                      >
                        <span>{c}</span>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Custom Status Dropdown */}
            <div ref={statusDropdownRef} className="relative">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsCategoryOpen(false);
                  setIsCurrencyOpen(false);
                  setIsCycleOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={isStatusOpen}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'Active' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : status === 'Paused' ? 'bg-slate-400' : 'bg-purple-400'
                  }`} />
                  <span className="font-medium text-xs sm:text-sm">{status}</span>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isStatusOpen ? 'rotate-180 text-violet-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Status Menu */}
              {isStatusOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-full rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl z-40 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {STATUS_OPTIONS.map((st) => {
                    const isSelected = status === st.value;
                    return (
                      <button
                        key={st.value}
                        type="button"
                        onClick={() => {
                          updateField('status', st.value);
                          setIsStatusOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-violet-600 text-white font-bold shadow-sm'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 dark:hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            st.value === 'Active' ? 'bg-emerald-400' : st.value === 'Paused' ? 'bg-slate-400' : 'bg-purple-400'
                          }`} />
                          <span>{st.label}</span>
                        </div>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Next Renewal Date — 100% Custom React DatePicker */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Next Renewal Date
            </label>
            <CustomDatePicker
              value={renewal}
              onChange={(val) => updateField('renewal', val)}
              placeholder="Select next renewal date..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100/80 hover:bg-slate-200 dark:text-slate-300 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="py-3 px-3.5 rounded-xl font-semibold text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors cursor-pointer"
              title="Clear all inputs in this form"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-violet-700 to-amber-500 hover:from-violet-600 hover:to-amber-400 hover:scale-[1.02] active:scale-95 transition-all text-white shadow-lg shadow-violet-500/25 cursor-pointer text-center"
            >
              {initialData ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
