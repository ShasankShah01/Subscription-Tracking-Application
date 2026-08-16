import React from 'react';
import { useTheme } from '../context/ThemeContext';

// ── Sun Icon ──────────────────────────────────────────────────────────────────
function SunIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-[18px] h-[18px] ${className}`}
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2"    x2="12" y2="5"    />
      <line x1="12" y1="19"   x2="12" y2="22"   />
      <line x1="4.22"  y1="4.22"  x2="6.34"  y2="6.34"  />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2"  y1="12" x2="5"  y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22"  y1="19.78" x2="6.34"  y2="17.66" />
      <line x1="17.66" y1="6.34"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

// ── Moon Icon ─────────────────────────────────────────────────────────────────
function MoonIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-[16px] h-[16px] ${className}`}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

// ── ThemeToggle ───────────────────────────────────────────────────────────────
/**
 * Rotating icon-swap toggle button.
 *
 * Mechanism:
 *  - Both Sun and Moon icons are absolutely stacked inside a 36×36 wrapper.
 *  - The OUTGOING icon rotates 90° and scales to 0 (disappears).
 *  - The INCOMING icon rotates from -90° to 0° and scales to 1 (appears).
 *  - A frosted-glass pill hover effect wraps the whole button.
 */
export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="
        relative flex items-center justify-center
        w-9 h-9 rounded-full shrink-0
        hover:bg-slate-200 dark:hover:bg-slate-800
        hover:backdrop-blur-sm
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-[#0B1120]
      "
    >
      {/* ── Icon container: fixed size, overflow hidden so rotations don't spill ── */}
      <span className="relative w-[18px] h-[18px] overflow-hidden flex items-center justify-center">

        {/* Sun — visible in light mode */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform:  isDarkMode ? 'rotate(90deg) scale(0)'  : 'rotate(0deg) scale(1)',
            opacity:    isDarkMode ? 0 : 1,
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease',
          }}
        >
          <SunIcon className={`text-amber-500 ${!isDarkMode ? 'toggle-icon-sun' : ''}`} />
        </span>

        {/* Moon — visible in dark mode */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform:  isDarkMode ? 'rotate(0deg) scale(1)'  : 'rotate(-90deg) scale(0)',
            opacity:    isDarkMode ? 1 : 0,
            transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease',
          }}
        >
          <MoonIcon className={`text-violet-400 ${isDarkMode ? 'toggle-icon-moon' : ''}`} />
        </span>

      </span>
    </button>
  );
}
