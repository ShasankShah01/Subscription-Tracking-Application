import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CurrencySelector from '../components/CurrencySelector';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { Joyride, STATUS } from 'react-joyride';

export default function DashboardLayout({ user, displayCurrency, setDisplayCurrency }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);

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
    // Only run tour if user is logged in, they haven't seen it yet, and they are on a dashboard route
    const tourKey = `hasSeenTour_${user?.id || 'guest'}`;
    if (user && !localStorage.getItem(tourKey) && location.pathname.includes('/dashboard')) {
      setTourSteps([
        {
          target: 'body',
          content: `Welcome, ${user.name}! Let's explore your ${user.role} Dashboard.`,
          placement: 'center',
          disableBeacon: true,
        },
        {
          target: '.joyride-sidebar',
          content: 'Here is your main navigation. Switch between different views here.',
          placement: 'right',
        },
        {
          target: '.joyride-analytics',
          content: 'Your key metrics and analytics will appear here.',
          placement: 'bottom',
        },
        {
          target: '.joyride-add-sub',
          content: 'Click here to quickly add a new subscription to track.',
          placement: 'left',
        },
        {
          target: '.joyride-profile',
          content: 'Access your profile settings, toggle light/dark theme, and logout from here.',
          placement: 'bottom',
        }
      ]);
      setRunTour(true);
    }
  }, [user, location]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      const tourKey = `hasSeenTour_${user?.id || 'guest'}`;
      localStorage.setItem(tourKey, 'true');
    }
  };

  const handleLogoutClick = () => {
    // Assuming there's a global logout, but for now we'll fetch the backend and navigate
    fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    window.location.href = '/';
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans overflow-hidden transition-theme">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#06b6d4',
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            textColor: isDarkMode ? '#f8fafc' : '#0f172a',
            arrowColor: isDarkMode ? '#1e293b' : '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.6)'
          }
        }}
      />
      
      <Sidebar user={user} />
      
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto relative">
        {/* Ambient glows — deeper and more vibrant in dark mode */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 dark:bg-cyan-500/8 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400/5 dark:bg-violet-500/6 rounded-full blur-[100px] pointer-events-none" />

        {/* Dashboard Top Header — frosted glass on premium backgrounds */}
        <header className="sticky top-0 z-40 bg-slate-100/80 dark:bg-[#0B1120]/80 border-b border-slate-200 dark:border-white/5 backdrop-blur-xl shrink-0 shadow-sm dark:shadow-none">
          <div className="px-8 h-20 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {user?.role === 'Admin' ? 'Platform Admin' : user?.role === 'System Analyst' ? 'System Analyst' : 'My Workspace'}
            </h1>
            
            <div className="flex items-center gap-3">
              <CurrencySelector
                currentCurrency={displayCurrency}
                onChangeCurrency={setDisplayCurrency}
              />

              {/* Animated Theme Toggle — always visible in header */}
              <ThemeToggle />

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 relative" ref={dropdownRef}>
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{user?.name || 'User'}</div>
                  <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold">{user?.role || 'User'}</div>
                </div>
                
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors joyride-profile"
                >
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/8 rounded-xl shadow-xl dark:shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={() => { setIsDropdownOpen(false); navigate('/dashboard/settings'); }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Profile Settings
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-slate-100 dark:bg-[#0B1120] transition-theme">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
