import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  currentView,
  onGoLanding,
  onGoDashboard,
  user,
  onLogout,
  onOpenAuth
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl'
          : 'bg-slate-950/60 backdrop-blur-md border-b border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button onClick={onGoLanding} className="flex items-center gap-3 group text-left">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-royal-purple-600 to-gold-400 opacity-75 blur transition duration-300 group-hover:opacity-100" />
            <div className="relative w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center font-black text-xl text-white border border-slate-800 shadow-inner">
              <span className="bg-gradient-to-tr from-royal-purple-400 to-gold-400 bg-clip-text text-transparent">
                S
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-white">
                ST<span className="text-royal-purple-400">Art</span>
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
              100% Free Mini-Project
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <button
            onClick={onGoLanding}
            className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
              currentView === 'landing'
                ? 'bg-royal-purple-500/20 text-royal-purple-300 border border-royal-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>
          <a
            href="#features"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Features
          </a>
          <a
            href="#dashboard-preview"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Preview
          </a>
          <a
            href="#calculator"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Savings Calculator
          </a>
          <a
            href="#feedback"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Feedback
          </a>
        </nav>

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-purple-500/10 border border-royal-purple-500/20 text-[11px] font-semibold text-royal-purple-400">
            <span className="w-2 h-2 rounded-full bg-royal-purple-400 animate-pulse" />
            100% Free Tool
          </span>

          <button
            onClick={onGoDashboard}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-royal-purple-600 to-royal-purple-500 shadow-lg shadow-royal-purple-500/20 hover:shadow-royal-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <span>View Dashboard</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-xl bg-royal-purple-500/20 border border-royal-purple-500/40 text-royal-purple-300 flex items-center justify-center font-bold text-sm shadow-inner hover:bg-royal-purple-500/30 transition-colors"
              >
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => { toggleTheme(); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-between items-center"
                  >
                    <span>Toggle Theme</span>
                    <span className="text-xs text-slate-500">{isDarkMode ? 'Dark' : 'Light'}</span>
                  </button>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                  <button 
                    onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-sm text-slate-300">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoLanding();
              }}
              className="text-left hover:text-white transition-colors"
            >
              Home
            </button>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#dashboard-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Dashboard Preview
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Savings Calculator
            </a>
            <a
              href="#feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Community Feedback
            </a>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoDashboard();
              }}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-royal-purple-600 to-royal-purple-500 text-center"
            >
              View Dashboard
            </button>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-rose-400 bg-slate-900 border border-slate-800"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-300 bg-slate-900 border border-slate-800"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
