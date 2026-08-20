import React, { useState } from 'react';
import CurrencySelector from '../components/CurrencySelector';
import CustomSelect from '../components/CustomSelect';
import { useTheme } from '../context/ThemeContext';

const TABS = ['Profile', 'Preferences', 'Notifications'];

const COUNTRY_OPTIONS = [
  { value: 'India', label: 'India (INR ₹)' },
  { value: 'United States', label: 'United States (USD $)' },
  { value: 'United Kingdom', label: 'United Kingdom (GBP £)' },
  { value: 'Germany', label: 'Germany (EUR €)' },
  { value: 'Canada', label: 'Canada (CAD C$)' },
  { value: 'Australia', label: 'Australia (AUD A$)' },
  { value: 'Japan', label: 'Japan (JPY ¥)' },
  { value: 'Switzerland', label: 'Switzerland (CHF)' },
  { value: 'Singapore', label: 'Singapore (SGD S$)' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates (AED)' },
];

export default function SettingsView({ user, setUser, onLogout, displayCurrency, setDisplayCurrency }) {
  const [activeTab, setActiveTab] = useState('Profile');
  const { isDarkMode, toggleTheme } = useTheme();

  // Profile edit state
  const [editName, setEditName] = useState(user?.name || '');
  const [editCountry, setEditCountry] = useState(user?.country || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Notification toggles (persisted in localStorage)
  const [notifRenewal, setNotifRenewal] = useState(() =>
    localStorage.getItem('notif_renewal') !== 'false'
  );
  const [notifEmail, setNotifEmail] = useState(() =>
    localStorage.getItem('notif_email') !== 'false'
  );
  const [notifTrial, setNotifTrial] = useState(() =>
    localStorage.getItem('notif_trial') !== 'false'
  );

  const handleNotifToggle = (key, val, setter) => {
    setter(val);
    localStorage.setItem(key, String(val));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, country: editCountry }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to update profile.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Server offline. Changes could not be saved.' });
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(null), 4000);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Workspace Settings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences and application settings.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-800 text-royal-purple-700 dark:text-royal-purple-300 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB: Profile ──────────────────────────────────────────────────────── */}
      {activeTab === 'Profile' && (
        <div className="space-y-6">
          {/* Avatar + Info Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-5 uppercase tracking-wider">
              Account Information
            </h3>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-royal-purple-100 dark:bg-royal-purple-500/10 border border-royal-purple-200 dark:border-royal-purple-500/30 text-royal-purple-700 dark:text-royal-purple-400 flex items-center justify-center text-2xl font-black shadow-inner">
                {(user?.name || 'U').charAt(0)}
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">{user?.email || 'user@example.com'}</div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-royal-purple-100 dark:bg-royal-purple-500/20 text-royal-purple-700 dark:text-royal-purple-300 border border-royal-purple-200 dark:border-royal-purple-500/30">
                    {user?.role || 'User'}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {user?.country || 'India'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:border-royal-purple-500 dark:focus:border-royal-purple-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <CustomSelect
                    value={editCountry}
                    onChange={(val) => setEditCountry(val)}
                    options={COUNTRY_OPTIONS}
                    placeholder="Select your country"
                  />
                </div>
              </div>

              {profileMsg && (
                <div className={`px-4 py-2.5 rounded-xl text-xs font-bold border ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                    : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                }`}>
                  {profileMsg.text}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-700 to-amber-500 hover:from-violet-600 hover:to-amber-400 shadow-md shadow-violet-500/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB: Preferences ────────────────────────────────────────────────── */}
      {activeTab === 'Preferences' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-6">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Application Preferences
          </h3>

          {/* Currency */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Default Currency</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Override your country's default display currency.
              </p>
            </div>
            <CurrencySelector currentCurrency={displayCurrency} onChangeCurrency={setDisplayCurrency} />
          </div>

          <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isDarkMode
                  ? 'Exquisite midnight black with champagne accents.'
                  : 'Crisp white with soft royal purple highlights.'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isDarkMode ? 'bg-royal-purple-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                isDarkMode ? 'translate-x-6' : ''
              }`} />
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: Notifications ──────────────────────────────────────────────── */}
      {activeTab === 'Notifications' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl space-y-6">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Notification Preferences
          </h3>

          {[
            {
              key: 'notif_renewal',
              label: 'Renewal Alerts',
              desc: 'Get notified 3 days before any subscription renews.',
              value: notifRenewal,
              setter: (v) => handleNotifToggle('notif_renewal', v, setNotifRenewal),
            },
            {
              key: 'notif_email',
              label: 'Email Digest',
              desc: 'Weekly spending summary delivered to your inbox.',
              value: notifEmail,
              setter: (v) => handleNotifToggle('notif_email', v, setNotifEmail),
            },
            {
              key: 'notif_trial',
              label: 'Trial Expiry Warnings',
              desc: 'Alert when a free trial is 2 days from converting.',
              value: notifTrial,
              setter: (v) => handleNotifToggle('notif_trial', v, setNotifTrial),
            },
          ].map((item, idx, arr) => (
            <React.Fragment key={item.key}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => item.setter(!item.value)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    item.value ? 'bg-royal-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  aria-label={`Toggle ${item.label}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    item.value ? 'translate-x-6' : ''
                  }`} />
                </button>
              </div>
              {idx < arr.length - 1 && <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
