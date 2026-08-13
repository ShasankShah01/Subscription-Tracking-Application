import React, { useState } from 'react';
import CurrencySelector from '../components/CurrencySelector';
import { useTheme } from '../context/ThemeContext';

export default function SettingsView({ user, onLogout, displayCurrency, setDisplayCurrency }) {
  const [notifications, setNotifications] = useState(true);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-white">Workspace Settings</h2>
        <p className="text-sm text-slate-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">Account Information</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl font-black">
              {(user?.name || 'U').charAt(0)}
            </div>
            <div>
              <div className="text-lg font-bold text-white">{user?.name || 'User'}</div>
              <div className="text-sm text-slate-400 font-mono">{user?.email || 'user@example.com'}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {user?.role || 'User'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {user?.country || 'India'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
          >
            Sign Out Securely
          </button>
        </div>

        {/* Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">Application Preferences</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Default Currency Engine</h4>
                <p className="text-xs text-slate-500 mt-1">Override your country's default currency globally.</p>
              </div>
              <CurrencySelector
                currentCurrency={displayCurrency}
                onChangeCurrency={setDisplayCurrency}
              />
            </div>

            <div className="h-px w-full bg-slate-800/60" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Push Notifications</h4>
                <p className="text-xs text-slate-500 mt-1">Receive proactive alerts for upcoming renewals.</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            <div className="h-px w-full bg-slate-800/60" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">Aurora Dark Mode</h4>
                <p className="text-xs text-slate-500 mt-1">Toggle the vibrant dark theme aesthetics.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
