import React, { useState, useEffect, useRef } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Helpers for zero-dependency date math without UTC timezone shift bugs
function parseDateString(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function formatDateToISO(date) {
  if (!date || isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr) {
  const d = parseDateString(dateStr);
  if (!d) return '';
  const monthName = MONTH_NAMES[d.getMonth()].slice(0, 3);
  const day = d.getDate();
  const year = d.getFullYear();
  return `${monthName} ${day}, ${year}`;
}

export default function CustomDatePicker({
  value = '',
  onChange,
  placeholder = 'Select renewal date...',
  disabled = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const parsedValue = parseDateString(value);

  // Current month being viewed in calendar (defaults to selected date's month or current month)
  const [viewDate, setViewDate] = useState(() => parsedValue || new Date());

  const containerRef = useRef(null);

  // Sync view month if value prop changes externally
  useEffect(() => {
    const parsed = parseDateString(value);
    if (parsed) {
      setViewDate(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
    }
  }, [value]);

  // Click-outside listener & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day) => {
    const selected = new Date(currentYear, currentMonth, day);
    const isoString = formatDateToISO(selected);
    onChange?.(isoString);
    setIsOpen(false);
  };

  const handleSetToday = () => {
    const today = new Date();
    onChange?.(formatDateToISO(today));
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange?.('');
    setIsOpen(false);
  };

  // Calendar matrix calculation
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Matrix cells: previous month trailing days, current month days, next month leading days
  const calendarCells = [];

  // Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isPrev: true,
    });
  }

  // Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected =
      parsedValue &&
      parsedValue.getFullYear() === currentYear &&
      parsedValue.getMonth() === currentMonth &&
      parsedValue.getDate() === d;

    const today = new Date();
    const isToday =
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonth &&
      today.getDate() === d;

    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      isSelected,
      isToday,
    });
  }

  // Next month leading days to complete 35 or 42 grid slots
  const remainingSlots = (7 - (calendarCells.length % 7)) % 7;
  for (let nextD = 1; nextD <= remainingSlots; nextD++) {
    calendarCells.push({
      day: nextD,
      isCurrentMonth: false,
      isNext: true,
    });
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Trigger matching CustomSelect & Dual-Theme System */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5'
            : 'bg-white dark:bg-zinc-900/40 border border-slate-200/80 dark:border-white/10 shadow-inner hover:border-amber-400 dark:hover:border-[#F7E7CE]/40 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40'
        } ${isOpen ? 'ring-2 ring-amber-400 dark:ring-[#F7E7CE]/40 border-amber-400 dark:border-[#F7E7CE]/50' : ''}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {/* Calendar Icon with radiant gold / champagne glow */}
          <svg
            className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
              value
                ? 'text-amber-500 dark:text-[#F7E7CE]'
                : 'text-slate-400 dark:text-[#F7E7CE]/50'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <span
            className={`truncate text-xs sm:text-sm ${
              value
                ? 'font-semibold text-slate-900 dark:text-[#F7E7CE]'
                : 'text-slate-400 dark:text-slate-500 font-normal'
            }`}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </span>
        </div>

        {/* Action Icon / Chevron */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.('');
              }}
              className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-[#F7E7CE] transition-colors"
              title="Clear date"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 dark:text-[#F7E7CE]/60 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-amber-500 dark:text-[#F7E7CE]' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Popover Shell: Drop-Up Popover to prevent viewport collision */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-2 z-40 p-4 w-72 sm:w-80 rounded-2xl bg-white/95 dark:bg-[#050505] border border-slate-200 dark:border-[#F7E7CE]/20 shadow-[0_0_30px_rgba(247,231,206,0.05)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 select-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-[#F7E7CE]/70 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-[#F7E7CE] transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-900 dark:text-[#F7E7CE] tracking-wide">
                {MONTH_NAMES[currentMonth]}
              </span>
              <span className="text-sm font-black text-amber-500 dark:text-[#F7E7CE]/80">
                {currentYear}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-[#F7E7CE]/70 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-900 dark:hover:text-[#F7E7CE] transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 7-Column Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 py-1"
              >
                {name}
              </div>
            ))}
          </div>

          {/* 7-Column Calendar Grid Cells */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarCells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={`other-${idx}`}
                    className="h-8 flex items-center justify-center text-xs text-slate-300 dark:text-zinc-700 opacity-40 select-none cursor-default font-normal"
                  >
                    {cell.day}
                  </div>
                );
              }

              return (
                <button
                  key={`day-${cell.day}`}
                  type="button"
                  onClick={() => handleSelectDay(cell.day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer relative ${
                    cell.isSelected
                      ? 'bg-gradient-to-r from-violet-700 to-amber-500 text-white font-bold shadow-md shadow-violet-500/25 scale-105'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-amber-500 dark:hover:text-amber-400'
                  }`}
                >
                  <span>{cell.day}</span>
                  {/* Today dot indicator if not selected */}
                  {cell.isToday && !cell.isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-500 dark:bg-[#F7E7CE]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Actions: Today & Clear */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSetToday}
              className="font-bold text-violet-600 dark:text-[#F7E7CE] hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800/60"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800/60"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
