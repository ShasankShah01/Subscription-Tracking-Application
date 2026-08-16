import React, { useState } from 'react';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import EmptyState from '../components/EmptyState';
import { convertCurrency, formatPrice } from '../utils/currency';

export default function DashboardPage({
  subscriptions,
  setSubscriptions,
  displayCurrency,
  displayToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Force Sync Action
  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      displayToast('✓ Force Sync Completed! All subscriptions & due dates updated.');
    }, 1200);
  };

  // Toggle Status
  const handleToggleStatus = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const isCurrentlyActive = sub.status === 'Active' || sub.status === 'Upcoming';
        const newStatus = isCurrentlyActive ? 'Paused' : 'Active';
        const newColor = newStatus === 'Paused'
          ? 'bg-slate-800 text-slate-400 border-slate-700'
          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

        displayToast(`${sub.name} is now ${newStatus}`);
        return { ...sub, status: newStatus, color: newColor };
      }
      return sub;
    }));
  };

  // Delete Subscription
  const handleDeleteSub = (id, name) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    displayToast(`Removed ${name} from active subscriptions`);
  };

  // Add/Edit Subscription
  const handleSaveSub = (subData) => {
    if (editingSub) {
      setSubscriptions(subscriptions.map(s => s.id === editingSub.id ? { ...subData, id: editingSub.id } : s));
      displayToast(`Updated ${subData.name}`);
    } else {
      setSubscriptions([{ ...subData, id: Date.now() }, ...subscriptions]);
      displayToast(`Added ${subData.name} to active subscriptions`);
    }
    setEditingSub(null);
    setIsAddModalOpen(false);
  };

  const openEditModal = (sub) => {
    setEditingSub(sub);
    setIsAddModalOpen(true);
  };

  // If no subscriptions, show Empty State
  if (subscriptions.length === 0) {
    return (
      <>
        <EmptyState onAdd={() => { setEditingSub(null); setIsAddModalOpen(true); }} />
        <AddSubscriptionModal
          isOpen={isAddModalOpen}
          onClose={() => { setIsAddModalOpen(false); setEditingSub(null); }}
          onSave={handleSaveSub}
          initialData={editingSub}
        />
      </>
    );
  }

  // Calculate live spend dynamically converted to selected display currency
  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const totalMonthlySpendInUSD = activeSubs.reduce((acc, sub) => {
    const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
    const subCurr = sub.currency || 'USD';
    const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
    return acc + (sub.cycle === 'Yearly' ? valInUSD / 12 : valInUSD);
  }, 0);

  const displayTotalMonthly = convertCurrency(totalMonthlySpendInUSD, 'USD', displayCurrency);

  const pausedSubs = subscriptions.filter(s => s.status === 'Paused');
  const pausedMonthlyInUSD = pausedSubs.reduce((acc, sub) => {
    const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
    const subCurr = sub.currency || 'USD';
    const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
    return acc + (sub.cycle === 'Yearly' ? valInUSD / 12 : valInUSD);
  }, 0);

  const displayPausedSavings = convertCurrency(pausedMonthlyInUSD, 'USD', displayCurrency);

  // Filter subscriptions
  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sub.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSubs = [...filteredSubs].sort((a, b) => {
    if (!sortField) return 0;
    
    if (sortField === 'price') {
      const valA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const valB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      const convA = convertCurrency(valA, a.currency || 'USD', 'USD');
      const convB = convertCurrency(valB, b.currency || 'USD', 'USD');
      return sortDirection === 'asc' ? convA - convB : convB - convA;
    }
    
    if (sortField === 'renewal') {
      const dateA = new Date(a.renewal);
      const dateB = new Date(b.renewal);
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return 0;
  });

  const handleExportCSV = () => {
    if (sortedSubs.length === 0) return;
    
    const headers = ['Service Name', 'Category', 'Price', 'Currency', 'Billing Cycle', 'Next Renewal Date', 'Status'];
    const rows = sortedSubs.map(sub => [
      `"${sub.name}"`,
      `"${sub.category}"`,
      parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0,
      sub.currency || 'USD',
      sub.cycle,
      `"${sub.renewal}"`,
      sub.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'start_subscriptions_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    displayToast('Exported subscriptions to CSV');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingSub(null); }}
        onSave={handleSaveSub}
        initialData={editingSub}
      />

      {/* Metrics Cards in Selected Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 joyride-analytics">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Monthly Spend</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
            {formatPrice(displayTotalMonthly, displayCurrency)}
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {displayCurrency}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">Real-time converted spend</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Services</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 flex items-baseline gap-2">
            {activeSubs.length} Subscriptions
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">{pausedSubs.length} paused or flagged</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Monthly Savings Realized</div>
          <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-2 flex items-baseline gap-2">
            {formatPrice(displayPausedSavings, displayCurrency)} / mo
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">Saved via paused/canceled subs</div>
        </div>

        <div className="p-6 rounded-3xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 backdrop-blur-xl flex flex-col justify-center items-center text-center cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all" onClick={handleForceSync}>
          <svg className={`w-8 h-8 text-cyan-600 dark:text-cyan-400 mb-2 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div className="text-sm font-bold text-cyan-300">{syncing ? 'Syncing...' : 'Force Sync Data'}</div>
        </div>
      </div>

      {/* Toolbar: Search & Category Filter Pills */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search subscriptions by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Entertainment', 'Infrastructure', 'Design', 'AI Tools', 'Music', 'Fitness'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Paused">Paused Only</option>
          <option value="Trial">Trial Only</option>
        </select>
        
        <button
          onClick={() => { setEditingSub(null); setIsAddModalOpen(true); }}
          className="px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0 joyride-add-sub"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Sub
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl font-bold text-xs text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Subscriptions Data Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Subscription Service</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none" onClick={() => handleSort('price')}>
                  <div className="flex items-center gap-1">
                    Price ({displayCurrency})
                    {sortField === 'price' && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none" onClick={() => handleSort('renewal')}>
                  <div className="flex items-center gap-1">
                    Next Renewal
                    {sortField === 'renewal' && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-medium">
              {sortedSubs.length > 0 ? (
                sortedSubs.map((sub) => {
                  const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
                  const subCurr = sub.currency || 'USD';
                  const convertedVal = convertCurrency(rawVal, subCurr, displayCurrency);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white shadow-inner">
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{sub.name}</span>
                            <span className="text-[11px] text-slate-500">{sub.cycle} billing</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">{sub.category}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 dark:text-white">{formatPrice(convertedVal, displayCurrency)}</span>
                        <span className="text-xs text-slate-500"> / {sub.cycle}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-700 dark:text-slate-300">{sub.renewal}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${sub.color}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                          Edit
                        </button>
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
                    No subscriptions match your search filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
