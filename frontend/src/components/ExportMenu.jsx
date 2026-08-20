import React, { useState, useRef, useEffect } from 'react';
import { convertCurrency } from '../utils/currency';

export default function ExportMenu({
  subscriptions = [],
  displayCurrency = 'USD',
  displayToast,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Format date helper (YYYY-MM-DD)
  const formatDateForCSV = (rawDate) => {
    if (!rawDate) return 'N/A';
    try {
      if (typeof rawDate === 'string' && rawDate.includes('T')) {
        return rawDate.split('T')[0];
      }
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      return String(rawDate).trim();
    } catch {
      return String(rawDate).trim();
    }
  };

  // Helper to trigger file download with UTF-8 BOM (prevents Excel character encoding issues)
  const downloadCSV = (csvContent, fileName) => {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 1. Standard CSV Export
  const handleExportStandard = (e) => {
    e?.stopPropagation?.();
    setIsOpen(false);

    if (!subscriptions || subscriptions.length === 0) {
      displayToast?.('No subscriptions to export');
      return;
    }

    const headers = [
      'Subscription Name',
      'Category',
      'Price',
      'Currency',
      'Billing Cycle',
      'Next Renewal Date',
      'Status',
    ];

    const rows = subscriptions.map((sub) => {
      const priceStr = String(sub?.price || '0');
      const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const cleanName = `"${String(sub?.name || 'Untitled').replace(/"/g, '""')}"`;
      const cleanCategory = `"${String(sub?.category || 'General').replace(/"/g, '""')}"`;
      const currencyCode = `"${String(sub?.currency || 'USD').replace(/"/g, '""')}"`;
      const billingCycle = `"${String(sub?.cycle || sub?.billingCycle || 'Monthly').replace(/"/g, '""')}"`;
      const renewalDate = `"${formatDateForCSV(sub?.renewal || sub?.nextRenewalDate)}"`;
      const status = `"${String(sub?.status || 'Active').replace(/"/g, '""')}"`;

      return [cleanName, cleanCategory, numericPrice.toFixed(2), currencyCode, billingCycle, renewalDate, status].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `subscriptions_standard_${timestamp}.csv`);
    displayToast?.('✓ Standard CSV exported successfully');
  };

  // 2. Summary Report CSV Export
  const handleExportSummary = (e) => {
    e?.stopPropagation?.();
    setIsOpen(false);

    if (!subscriptions || subscriptions.length === 0) {
      displayToast?.('No subscriptions to export');
      return;
    }

    const activeSubs = subscriptions.filter((s) => s && s.status === 'Active');
    const pausedSubs = subscriptions.filter((s) => s && s.status === 'Paused');
    const trialSubs = subscriptions.filter((s) => s && s.status === 'Trial');

    // Calculate total spend converted to current display currency
    const totalSpendInUSD = activeSubs.reduce((acc, sub) => {
      const priceStr = String(sub?.price || '0');
      const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const subCurr = sub?.currency || 'USD';
      const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
      return acc + (sub?.cycle === 'Yearly' || sub?.billingCycle === 'Yearly' ? valInUSD / 12 : valInUSD);
    }, 0);

    const convertedTotal = convertCurrency(totalSpendInUSD, 'USD', displayCurrency);

    const headers = [
      'Subscription Name',
      'Category',
      'Price',
      'Currency',
      'Billing Cycle',
      'Next Renewal Date',
      'Status',
    ];

    const dataRows = subscriptions.map((sub) => {
      const priceStr = String(sub?.price || '0');
      const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const cleanName = `"${String(sub?.name || 'Untitled').replace(/"/g, '""')}"`;
      const cleanCategory = `"${String(sub?.category || 'General').replace(/"/g, '""')}"`;
      const currencyCode = `"${String(sub?.currency || 'USD').replace(/"/g, '""')}"`;
      const billingCycle = `"${String(sub?.cycle || sub?.billingCycle || 'Monthly').replace(/"/g, '""')}"`;
      const renewalDate = `"${formatDateForCSV(sub?.renewal || sub?.nextRenewalDate)}"`;
      const status = `"${String(sub?.status || 'Active').replace(/"/g, '""')}"`;

      return [cleanName, cleanCategory, numericPrice.toFixed(2), currencyCode, billingCycle, renewalDate, status].join(',');
    });

    const summarySection = [
      '',
      '"--- SUMMARY REPORT ---"',
      `"Total Active Subscriptions",${activeSubs.length}`,
      `"Total Paused Subscriptions",${pausedSubs.length}`,
      `"Total Trial Subscriptions",${trialSubs.length}`,
      `"Total Monthly Spend (${displayCurrency})",${convertedTotal.toFixed(2)},"${displayCurrency}"`,
      `"Report Generated",${formatDateForCSV(new Date())}`,
    ];

    const csvContent = [headers.join(','), ...dataRows, ...summarySection].join('\r\n');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `subscriptions_summary_report_${timestamp}.csv`);
    displayToast?.('✓ Summary Report CSV exported successfully');
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left shrink-0">
      {/* Export Dropdown Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="px-4 py-2 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-95"
      >
        <svg className="w-4 h-4 text-violet-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>Export Data</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-violet-600 dark:text-amber-400' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-950/95 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Export Options
          </div>

          <button
            type="button"
            onClick={handleExportStandard}
            className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-600/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 font-mono text-[10px] font-bold">
              CSV
            </div>
            <div>
              <span className="block font-bold">Export as CSV (Standard)</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Clean list of active & paused subscriptions</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportSummary}
            className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-500/20 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer mt-0.5"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 font-mono text-[10px] font-bold">
              Σ
            </div>
            <div>
              <span className="block font-bold">Export as CSV (Summary Report)</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Includes calculated spend & status totals</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
