import React, { useState } from 'react';
import CustomSelect from './CustomSelect';
import { validatePassword } from '../utils/validation';

const AUTH_COUNTRY_OPTIONS = [
  { value: 'India', label: 'India (Default Currency: INR ₹)' },
  { value: 'United States', label: 'United States (Default Currency: USD $)' },
  { value: 'United Kingdom', label: 'United Kingdom (Default Currency: GBP £)' },
  { value: 'Germany', label: 'Germany (Default Currency: EUR €)' },
  { value: 'Canada', label: 'Canada (Default Currency: CAD C$)' },
  { value: 'Australia', label: 'Australia (Default Currency: AUD A$)' },
  { value: 'Japan', label: 'Japan (Default Currency: JPY ¥)' },
];

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('India');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Close modal on Escape
  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const passwordEval = validatePassword(password, email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (tab === 'signup' && !passwordEval.isValid) {
      setErrorMsg('Password does not satisfy security requirements.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const body = tab === 'login'
        ? { email, password }
        : { name: fullName, email, password, country };

      const res = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorText = data?.message || data?.error || (tab === 'login' ? 'Login failed. Please verify your credentials.' : 'Registration failed. Please check your inputs.');
        throw new Error(errorText);
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        (tab === 'login' ? 'Login failed. Please check your credentials.' : 'Registration failed. Please check your inputs.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-white/95 dark:bg-zinc-950/90 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        
        {/* Glow ambient background sphere */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-violet-500/20">
              S
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-[#F7E7CE]">STArt Workspace</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Subscription Tracking Application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-[#F7E7CE] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close auth modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 mb-6 rounded-2xl bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-zinc-800 text-violet-600 dark:text-[#F7E7CE] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-white dark:bg-zinc-800 text-violet-600 dark:text-[#F7E7CE] shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-semibold animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all"
            />
          </div>

          {tab === 'signup' && (
            <div className="relative">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Country (Auto-Currency Config)
              </label>
              <CustomSelect
                value={country}
                onChange={(val) => setCountry(val)}
                options={AUTH_COUNTRY_OPTIONS}
                size="sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all"
            />

            {/* Password strength checklist on signup */}
            {tab === 'signup' && password.length > 0 && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 text-[11px] space-y-1">
                <div className={passwordEval.checks.minLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                  {passwordEval.checks.minLength ? '✓' : '•'} Minimum 8 characters
                </div>
                <div className={passwordEval.checks.hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                  {passwordEval.checks.hasUppercase ? '✓' : '•'} At least 1 uppercase letter (A-Z)
                </div>
                <div className={passwordEval.checks.hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                  {passwordEval.checks.hasLowercase ? '✓' : '•'} At least 1 lowercase letter (a-z)
                </div>
                <div className={passwordEval.checks.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                  {passwordEval.checks.hasNumber ? '✓' : '•'} At least 1 number (0-9)
                </div>
                <div className={passwordEval.checks.hasSpecial ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                  {passwordEval.checks.hasSpecial ? '✓' : '•'} At least 1 special character (@, $, !, %, etc.)
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-700 to-amber-500 hover:from-violet-600 hover:to-amber-400 shadow-lg shadow-violet-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              tab === 'login' ? 'Sign In to Workspace' : 'Create Free Account'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          100% Free College Utility • HttpOnly Cookie & JWT Security
        </p>
      </div>
    </div>
  );
}
