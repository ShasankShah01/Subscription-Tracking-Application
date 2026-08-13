import React, { useState, useEffect } from 'react';

export default function Navbar({ onDashboardClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 opacity-75 blur transition duration-300 group-hover:opacity-100" />
            <div className="relative w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center font-black text-xl text-white border border-white/10 shadow-inner">
              <span className="bg-gradient-to-tr from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
                S
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                ST
              </span>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Art
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 -mt-1">
              Subscription Hub
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-zinc-900/60 border border-white/10 backdrop-blur-md">
          <a
            href="#features"
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Features
          </a>
          <a
            href="#dashboard-preview"
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Dashboard
          </a>
          <a
            href="#calculator"
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Savings Calculator
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
          >
            Reviews
          </a>
        </nav>

        {/* CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            MERN Live Engine
          </span>

          <button
            onClick={onDashboardClick}
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 shadow-lg shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-indigo-400/30"
          >
            <span className="relative z-10 flex items-center gap-2">
              View Dashboard
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white"
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
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-sm text-zinc-300">
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
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white transition-colors"
            >
              Reviews
            </a>
          </div>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDashboardClick();
              }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all text-center"
            >
              View Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
