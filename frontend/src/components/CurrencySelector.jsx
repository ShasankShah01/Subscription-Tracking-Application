import React from 'react';
import CustomSelect from './CustomSelect';
import { CURRENCY_SYMBOLS } from '../utils/currency';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'CHF', label: 'CHF (CHF)', symbol: 'CHF' },
  { value: 'CNY', label: 'CNY (¥)', symbol: '¥' },
  { value: 'HKD', label: 'HKD (HK$)', symbol: 'HK$' },
  { value: 'NZD', label: 'NZD (NZ$)', symbol: 'NZ$' },
  { value: 'SEK', label: 'SEK (kr)', symbol: 'kr' },
  { value: 'KRW', label: 'KRW (₩)', symbol: '₩' },
  { value: 'SGD', label: 'SGD (S$)', symbol: 'S$' },
  { value: 'NOK', label: 'NOK (kr)', symbol: 'kr' },
  { value: 'MXN', label: 'MXN (Mex$)', symbol: 'Mex$' },
  { value: 'ZAR', label: 'ZAR (R)', symbol: 'R' },
  { value: 'TRY', label: 'TRY (₺)', symbol: '₺' },
  { value: 'BRL', label: 'BRL (R$)', symbol: 'R$' },
  { value: 'AED', label: 'AED (AED)', symbol: 'AED' },
];

export default function CurrencySelector({ currentCurrency, onChangeCurrency }) {
  const currentSymbol = CURRENCY_SYMBOLS[currentCurrency] || '$';

  return (
    <div className="relative inline-block w-36">
      <CustomSelect
        value={currentCurrency}
        onChange={(val) => onChangeCurrency?.(val)}
        options={CURRENCY_OPTIONS}
        size="sm"
        maxHeight="max-h-52"
        menuClassName="w-48 right-0 left-auto"
        renderTrigger={({ isOpen, setIsOpen, selectedOption }) => (
          <button
            type="button"
            onClick={setIsOpen}
            aria-label="Select display currency"
            aria-expanded={isOpen}
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-950/80 border border-slate-200 dark:border-[#F7E7CE]/20 text-xs font-semibold text-slate-800 dark:text-[#F7E7CE] shadow-sm hover:border-amber-400 dark:hover:border-[#F7E7CE]/50 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-500 dark:text-[#F7E7CE] font-bold">
                {currentSymbol}
              </span>
              <span className="truncate">{selectedOption?.label || currentCurrency}</span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-slate-400 dark:text-[#F7E7CE]/60 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-amber-500 dark:text-[#F7E7CE]' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      />
    </div>
  );
}
