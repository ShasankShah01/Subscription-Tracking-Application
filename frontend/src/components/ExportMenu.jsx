import React, { useState, useRef, useEffect } from 'react';

export default function ExportMenu({
  subscriptions = [],
  displayCurrency = 'USD',
  displayToast,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportingType, setExportingType] = useState(null);
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

// 1. Raw CSV Export Handler
  const handleExportCSV = async (e) => {
    e?.stopPropagation?.();
    setIsOpen(false);

    if (!subscriptions || subscriptions.length === 0) {
      displayToast?.('No subscriptions to export');
      return;
    }

    try {
      setExportingType('csv');
      const { exportToCSV } = await import('../utils/exportUtils');
      const ok = exportToCSV(subscriptions, displayCurrency);
      if (ok) {
        displayToast?.('✓ Raw CSV exported successfully');
      }
    } catch (err) {
      console.error('CSV Export Error:', err);
      displayToast?.('Failed to export CSV. Please try again.');
    } finally {
      setExportingType(null);
    }
  };

  // 2. Financial Excel Export Handler
  const handleExportExcel = async (e) => {
    e?.stopPropagation?.();
    setIsOpen(false);

    if (!subscriptions || subscriptions.length === 0) {
      displayToast?.('No subscriptions to export');
      return;
    }

    try {
      setExportingType('excel');
      displayToast?.('Generating financial Excel report...');
      const { exportToExcel } = await import('../utils/exportUtils');
      const ok = await exportToExcel(subscriptions, displayCurrency);
      if (ok) {
        displayToast?.('✓ Financial Excel report exported successfully');
      }
    } catch (err) {
      console.error('Excel Export Error:', err);
      displayToast?.('Failed to export Excel. Please try again.');
    } finally {
      setExportingType(null);
    }
  };

  // 3. Visual PDF Export Handler
  const handleExportPDF = async (e) => {
    e?.stopPropagation?.();
    setIsOpen(false);

    if (!subscriptions || subscriptions.length === 0) {
      displayToast?.('No subscriptions to export');
      return;
    }

    try {
      setExportingType('pdf');
      displayToast?.('Rendering visual PDF summary...');
      const { exportToPDF } = await import('../utils/exportUtils');
      const ok = exportToPDF(subscriptions, displayCurrency);
      if (ok) {
        displayToast?.('✓ Visual PDF summary exported successfully');
      }
    } catch (err) {
      console.error('PDF Export Error:', err);
      displayToast?.('Failed to export PDF. Please try again.');
    } finally {
      setExportingType(null);
    }
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
        disabled={Boolean(exportingType)}
        className="px-4 py-2 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-zinc-900/90 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-zinc-800 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer select-none active:scale-95 disabled:opacity-60"
      >
        {exportingType ? (
          <svg className="w-4 h-4 text-violet-600 dark:text-amber-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-violet-600 dark:text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        <span>{exportingType ? 'Exporting...' : 'Export Data'}</span>
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
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-950/95 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Export Options
          </div>

          {/* 1. CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-600/20 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 font-mono text-[10px] font-bold">
              CSV
            </div>
            <div>
              <span className="block font-bold">Export CSV (Raw Data)</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Clean comma-separated values</span>
            </div>
          </button>

          {/* 2. Excel */}
          <button
            type="button"
            onClick={handleExportExcel}
            className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer mt-1"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-[10px] font-bold">
              XLSX
            </div>
            <div>
              <span className="block font-bold">Export Excel (Financial Report)</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Formatted accounting sheet with formulas</span>
            </div>
          </button>

          {/* 3. PDF */}
          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-rose-500/20 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer mt-1"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-mono text-[10px] font-bold">
              PDF
            </div>
            <div>
              <span className="block font-bold">Export PDF (Visual Summary)</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">Clean summary overview with spend metrics</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
