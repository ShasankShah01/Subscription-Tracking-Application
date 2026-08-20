import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CurrencySelector from '../components/CurrencySelector';
import ThemeToggle from '../components/ThemeToggle';
import FeedbackModal from '../components/FeedbackModal';
import WelcomeModal from '../components/WelcomeModal';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout({
  user,
  displayCurrency,
  setDisplayCurrency,
  feedbackList,
  onAddFeedback,
}) {
  const { isDarkMode } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#050505] text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-colors">
      {/* Oceanic Custom Welcome/Onboarding Modal */}
      <WelcomeModal user={user} />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        feedbackList={feedbackList}
        onAddFeedback={onAddFeedback}
      />

      {/* Sidebar — receives feedback click handler */}
      <Sidebar user={user} onFeedbackClick={() => setIsFeedbackOpen(true)} />

      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto relative">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-royal-purple-400/5 dark:bg-royal-purple-500/8 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gold-400/5 dark:bg-gold-500/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Dashboard Top Header — glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0B1120]/80 border-b border-slate-200 dark:border-white/5 backdrop-blur-xl shrink-0 shadow-sm dark:shadow-none">
          <div className="px-8 h-20 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {user?.role === 'Admin'
                ? 'Platform Admin'
                : user?.role === 'System Analyst'
                ? 'System Analyst'
                : 'My Workspace'}
            </h1>

            <div className="flex items-center gap-3">
              <CurrencySelector
                currentCurrency={displayCurrency}
                onChangeCurrency={setDisplayCurrency}
              />

              {/* Animated Theme Toggle */}
              <ThemeToggle />

              <div
                className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 relative"
                ref={dropdownRef}
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-xs text-royal-purple-600 dark:text-royal-purple-400 font-semibold">
                    {user?.role || 'User'}
                  </div>
                </div>

                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 text-royal-purple-600 dark:text-royal-purple-400 flex items-center justify-center font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all cursor-pointer"
                  aria-label="Open profile menu"
                >
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu — strictly Profile Settings and Logout */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-zinc-950/95 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-xl">
                    <button
                      onClick={() => { setIsDropdownOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:text-amber-500 dark:hover:text-[#F7E7CE] transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </button>
                    <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-slate-100 dark:bg-[#0B1120] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
