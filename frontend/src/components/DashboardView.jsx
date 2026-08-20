import React, { useState } from 'react';
import AddSubscriptionModal from './AddSubscriptionModal';
import CustomSelect from './CustomSelect';
import { useTheme } from '../context/ThemeContext';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Active', label: 'Active Only', badge: 'Active' },
  { value: 'Paused', label: 'Paused Only', badge: 'Paused' },
];

export default function DashboardView({
  subscriptions,
  setSubscriptions,
  user,
  onOpenAuth,
  onGoLanding
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Use global ThemeContext — no local state that conflicts
  const { isDarkMode, toggleTheme } = useTheme();

  const exportToCSV = () => {
    const headers = ['Subscription Service', 'Category', 'Price', 'Billing Cycle', 'Next Renewal', 'Status'];
    const csvRows = [headers.join(',')];

    filteredSubs.forEach(sub => {
      csvRows.push([
        `"${sub.name}"`,
        `"${sub.category}"`,
        `"${sub.price}"`,
        `"${sub.cycle}"`,
        `"${sub.renewal}"`,
        `"${sub.status}"`
      ].join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'subscriptions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Exported subscriptions to CSV');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Toggle status (Active <-> Paused)
  const handleToggleStatus = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const isCurrentlyActive = sub.status === 'Active' || sub.status === 'Upcoming';
        const newStatus = isCurrentlyActive ? 'Paused' : 'Active';
        const newColor = newStatus === 'Paused'
          ? 'bg-slate-800 text-slate-400 border-slate-700'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

        showToast(`${sub.name} is now ${newStatus}`);
        return { ...sub, status: newStatus, color: newColor };
      }
      return sub;
    }));
  };

  // Delete subscription
  const handleDeleteSub = (id, name) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    showToast(`Removed ${name} from your dashboard`);
  };

  // Add subscription
  const handleAddSub = (newSub) => {
    try {
      if (!newSub || !newSub.name) return;
      const subWithId = newSub.id ? newSub : { ...newSub, id: Date.now() };
      setSubscriptions([subWithId, ...(subscriptions || [])]);
      showToast(`Added ${newSub.name} to active subscriptions`);
    } catch (err) {
      console.error('Failed to add subscription in DashboardView:', err);
      showToast('Failed to add subscription');
    }
  };

  // Calculate live total monthly spend
  const activeSubs = (subscriptions || []).filter(s => s && s.status === 'Active');
  const totalMonthlySpend = activeSubs.reduce((acc, sub) => {
    const priceStr = String(sub?.price || '0');
    const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const monthlyVal = sub?.cycle === 'Yearly' ? rawVal / 12 : rawVal;
    return acc + monthlyVal;
  }, 0);

  const pausedSubs = (subscriptions || []).filter(s => s && s.status === 'Paused');
  const pausedMonthlySavings = pausedSubs.reduce((acc, sub) => {
    const priceStr = String(sub?.price || '0');
    const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    return acc + rawVal;
  }, 0);

  // Filter subscriptions
  let filteredSubs = (subscriptions || []).filter(sub => {
    if (!sub) return false;
    const nameStr = String(sub.name || '').toLowerCase();
    const catStr = String(sub.category || '').toLowerCase();
    const searchLower = String(searchTerm || '').toLowerCase();
    const matchesSearch = nameStr.includes(searchLower) || catStr.includes(searchLower);
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort subscriptions
  if (sortConfig.key) {
    filteredSubs.sort((a, b) => {
      if (sortConfig.key === 'price') {
        const valA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
        const valB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
        return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
      }
      if (sortConfig.key === 'renewal') {
        const dateA = new Date(a.renewal);
        const dateB = new Date(b.renewal);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/30 text-slate-900 dark:text-white text-xs font-bold shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSub}
      />

      {/* Dashboard Top Workspace Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onGoLanding}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-300 dark:hover:border-slate-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Landing Page
            </button>

            <div className="h-6 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-md shadow-cyan-500/20">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                ST<span className="text-cyan-600 dark:text-cyan-400">Art</span> Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
              )}
            </button>

            <button
              onClick={exportToCSV}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              Add Subscription
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-300 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{user.role || 'Active User'}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Summary Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Monthly Spend</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
              ${totalMonthlySpend.toFixed(2)}
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Live Total
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">Computed across active subscriptions</div>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Services</div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 flex items-baseline gap-2">
              {activeSubs.length} Subscriptions
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">{pausedSubs.length} paused or flagged</div>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Monthly Savings Realized</div>
            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-2 flex items-baseline gap-2">
              ${pausedMonthlySavings.toFixed(2)} / mo
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">Saved via paused/canceled subs</div>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Project License</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
              100% Free
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Open Utility
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">No paid tiers or hidden charges</div>
          </div>
        </div>

        {/* Controls Toolbar: Search & Category Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search subscriptions by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {['All', 'Entertainment', 'Infrastructure', 'Design', 'AI Tools', 'Music', 'Fitness'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 shadow-sm'
                    : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <CustomSelect
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              options={STATUS_FILTER_OPTIONS}
              size="sm"
            />
          </div>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl font-bold text-xs text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Subscriptions Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <tr>
                  <th className="px-6 py-4">Subscription Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300"
                    onClick={() => handleSort('price')}
                  >
                    Price / Billing {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-slate-300"
                    onClick={() => handleSort('renewal')}
                  >
                    Next Renewal {sortConfig.key === 'renewal' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
                           <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
                {(filteredSubs || []).length > 0 ? (
                  (filteredSubs || []).map((sub) => {
                    if (!sub) return null;
                    let displayRenewal = 'Next Month';
                    if (sub?.renewal) {
                      if (typeof sub.renewal === 'string') {
                        displayRenewal = sub.renewal.includes('T') ? sub.renewal.split('T')[0] : sub.renewal;
                      } else if (sub.renewal instanceof Date) {
                        displayRenewal = sub.renewal.toISOString().split('T')[0];
                      } else {
                        displayRenewal = String(sub.renewal);
                      }
                    }

                    return (
                      <tr key={sub.id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-inner">
                              {(sub.name || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{sub.name || 'Subscription'}</span>
                              <span className="text-[11px] text-slate-500">{sub.cycle || 'Monthly'} billing</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">{sub.category || 'General'}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-900 dark:text-white">{sub.price || '$0.00'}</span>
                          <span className="text-xs text-slate-500"> / {sub.cycle || 'Monthly'}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300">{displayRenewal}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${sub.color || 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStatus(sub.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              sub.status === 'Paused'
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {sub.status === 'Paused' ? 'Resume' : 'Pause'}
                          </button>
                          <button
                            onClick={() => handleDeleteSub(sub.id, sub.name)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/20 transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-sm">
                      No subscriptions match your search filter. Click <strong className="text-cyan-600 dark:text-cyan-400 cursor-pointer" onClick={() => setIsAddModalOpen(true)}>Add Subscription</strong> to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
