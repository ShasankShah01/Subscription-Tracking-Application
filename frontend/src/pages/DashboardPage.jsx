import React, { useState } from 'react';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import CustomSelect from '../components/CustomSelect';
import ExportMenu from '../components/ExportMenu';
import { convertCurrency, formatPrice } from '../utils/currency';
import { apiFetch } from '../utils/api';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Active', label: 'Active Only', badge: 'Active' },
  { value: 'Paused', label: 'Paused Only', badge: 'Paused' },
  { value: 'Trial', label: 'Trial Only', badge: 'Trial' },
];

export default function DashboardPage({
  subscriptions = [],
  setSubscriptions,
  displayCurrency = 'USD',
  displayToast
}) {
  // All Hooks declared at top level (Rules of Hooks)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Persistent lifted draft state for Add Subscription modal
  const [subDraft, setSubDraft] = useState({
    name: '',
    category: 'Cloud & Hosting',
    customCategory: '',
    currency: displayCurrency || 'USD',
    price: '',
    cycle: 'Monthly',
    renewal: '',
    status: 'Active',
  });

  const handleClearDraft = () => {
    setSubDraft({
      name: '',
      category: 'Cloud & Hosting',
      customCategory: '',
      currency: displayCurrency || 'USD',
      price: '',
      cycle: 'Monthly',
      renewal: '',
      status: 'Active',
    });
  };

  // Sync Action with MongoDB
  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const res = await apiFetch('/subscriptions');
      if (res.ok && res.data?.subscriptions) {
        const mapped = res.data.subscriptions.map(s => ({
          ...s,
          id: s._id || s.id,
          name: s.serviceName || s.name,
          price: s.cost !== undefined ? `${displayCurrency === 'INR' ? '₹' : '$'}${s.cost}` : s.price,
          cycle: s.billingCycle || s.cycle,
          renewal: s.nextRenewalDate || s.renewal,
        }));
        setSubscriptions?.(mapped);
        displayToast?.('✓ Subscriptions synchronized with database.');
      } else {
        displayToast?.('✓ Subscriptions are up to date.');
      }
    } catch (err) {
      console.error('Failed to sync subscriptions:', err);
      displayToast?.('Sync failed. Please check connection.');
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Status with MongoDB persistence
  const handleToggleStatus = async (id) => {
    if (!setSubscriptions) return;
    const target = (subscriptions || []).find(sub => sub.id === id || sub._id === id);
    if (!target) return;

    const isCurrentlyActive = target.status === 'Active' || target.status === 'Upcoming';
    const newStatus = isCurrentlyActive ? 'Paused' : 'Active';
    const newColor = newStatus === 'Paused'
      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700'
      : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';

    // Optimistic UI update
    setSubscriptions((subscriptions || []).map(sub => {
      if (sub.id === id || sub._id === id) {
        return { ...sub, status: newStatus, color: newColor };
      }
      return sub;
    }));

    displayToast?.(`"${target.name || target.serviceName || 'Subscription'}" is now ${newStatus}`);

    // Persist to backend database
    const mongoId = target._id || target.id;
    if (mongoId) {
      await apiFetch(`/subscriptions/${mongoId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      }).catch(err => {
        console.error('Failed to update status on server:', err);
        displayToast?.('Failed to update status on server.');
      });
    }
  };

  // Safe Confirmed Deletion with MongoDB persistence
  const handleConfirmDelete = async () => {
    if (!deleteTarget || !setSubscriptions) return;
    setIsDeleting(true);
    const { id, name } = deleteTarget;

    try {
      const target = (subscriptions || []).find(sub => sub.id === id || sub._id === id);
      const mongoId = target?._id || target?.id || id;

      // Optimistic UI update
      setSubscriptions((subscriptions || []).filter(sub => sub.id !== id && sub._id !== id));
      displayToast?.(`Removed "${name}" from active subscriptions`);

      // Persist to backend database
      if (mongoId) {
        const res = await apiFetch(`/subscriptions/${mongoId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Failed to delete on server');
        }
      }
    } catch (err) {
      console.error('Failed to delete subscription on server:', err);
      displayToast?.('Failed to delete subscription. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Add/Edit Subscription with MongoDB persistence
  const handleSaveSub = async (subData) => {
    try {
      if (!subData || (!subData.name && !subData.serviceName)) return;

      const cleanName = String(subData.name || subData.serviceName || '').trim();
      const rawCost = subData.cost !== undefined
        ? Number(subData.cost)
        : parseFloat(String(subData.price || '0').replace(/[^0-9.]/g, '')) || 0;

      const payload = {
        serviceName: cleanName,
        name: cleanName,
        category: subData.category || 'Entertainment',
        cost: rawCost,
        currency: subData.currency || displayCurrency || 'USD',
        billingCycle: subData.cycle || subData.billingCycle || 'Monthly',
        nextRenewalDate: subData.renewal || subData.nextRenewalDate || new Date().toISOString(),
        status: subData.status || 'Active',
      };

      if (editingSub) {
        const subId = editingSub._id || editingSub.id;
        const res = await apiFetch(`/subscriptions/${subId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });

        if (res.ok && res.data?.subscription) {
          const updated = res.data.subscription;
          setSubscriptions?.((subscriptions || []).map(s =>
            (s._id === subId || s.id === subId)
              ? { ...updated, id: updated._id, name: updated.serviceName, price: subData.price || updated.cost, cycle: updated.billingCycle, renewal: updated.nextRenewalDate }
              : s
          ));
          displayToast?.(`Updated "${cleanName}" successfully`);
        } else {
          // Local fallback
          setSubscriptions?.((subscriptions || []).map(s =>
            (s._id === subId || s.id === subId) ? { ...subData, id: subId } : s
          ));
          displayToast?.(`Updated "${cleanName}" successfully`);
        }
      } else {
        const res = await apiFetch('/subscriptions', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        if (res.ok && res.data?.subscription) {
          const created = res.data.subscription;
          const mappedCreated = {
            ...created,
            id: created._id,
            name: created.serviceName,
            price: subData.price || `${subData.currency === 'INR' ? '₹' : '$'}${created.cost}`,
            cycle: created.billingCycle,
            renewal: created.nextRenewalDate,
          };
          setSubscriptions?.([mappedCreated, ...(subscriptions || [])]);
          displayToast?.(`Added "${cleanName}" to subscriptions`);
        } else {
          console.warn("Backend returned error on create, using fallback:", res.data);
          const fallbackSub = { ...subData, id: Date.now() };
          setSubscriptions?.([fallbackSub, ...(subscriptions || [])]);
          displayToast?.(`Added "${cleanName}" to subscriptions`);
        }
      }

      setEditingSub(null);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to save subscription in DashboardPage:', err);
      displayToast?.('Failed to save subscription. Please try again.');
    }
  };

  const openEditModal = (sub) => {
    setEditingSub(sub);
    setIsAddModalOpen(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate live spend dynamically converted to selected display currency
  const activeSubs = (subscriptions || []).filter(s => s && s.status === 'Active');
  const totalMonthlySpendInUSD = activeSubs.reduce((acc, sub) => {
    const priceStr = String(sub?.price || '0');
    const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const subCurr = sub?.currency || 'USD';
    const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
    return acc + (sub?.cycle === 'Yearly' ? valInUSD / 12 : valInUSD);
  }, 0);

  const displayTotalMonthly = convertCurrency(totalMonthlySpendInUSD, 'USD', displayCurrency);

  const pausedSubs = (subscriptions || []).filter(s => s && s.status === 'Paused');
  const pausedMonthlyInUSD = pausedSubs.reduce((acc, sub) => {
    const priceStr = String(sub?.price || '0');
    const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const subCurr = sub?.currency || 'USD';
    const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
    return acc + (sub?.cycle === 'Yearly' ? valInUSD / 12 : valInUSD);
  }, 0);

  const displayPausedSavings = convertCurrency(pausedMonthlyInUSD, 'USD', displayCurrency);

  // Filter subscriptions
  const filteredSubs = (subscriptions || []).filter(sub => {
    if (!sub) return false;
    const nameStr = String(sub.name || '').toLowerCase();
    const catStr = String(sub.category || '').toLowerCase();
    const searchLower = String(searchTerm || '').toLowerCase();
    const matchesSearch = nameStr.includes(searchLower) || catStr.includes(searchLower);
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || sub.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedSubs = [...(filteredSubs || [])].sort((a, b) => {
    if (!sortField || !a || !b) return 0;
    
    if (sortField === 'price') {
      const valA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const valB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
      const convA = convertCurrency(valA, a.currency || 'USD', 'USD');
      const convB = convertCurrency(valB, b.currency || 'USD', 'USD');
      return sortDirection === 'asc' ? convA - convB : convB - convA;
    }
    
    if (sortField === 'renewal') {
      const dateA = new Date(a.renewal);
      const dateB = new Date(b.renewal);
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    
    return 0;
  });

  const STANDARD_CATEGORIES = [
    'All',
    'Cloud & Hosting',
    'Developer Tools',
    'Domains & DNS',
    'AI Tools',
    'Infrastructure',
    'Productivity & SaaS',
    'Entertainment',
    'Music',
    'Design',
    'Utilities',
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Add / Edit Subscription Modal */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingSub(null); }}
        onSave={handleSaveSub}
        onSubmit={handleSaveSub}
        onAdd={handleSaveSub}
        initialData={editingSub}
        displayCurrency={displayCurrency}
        draftData={subDraft}
        onUpdateDraft={setSubDraft}
        onClearDraft={handleClearDraft}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        serviceName={deleteTarget?.name}
        onCancel={() => { if (!isDeleting) setDeleteTarget(null); }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Metrics Cards in Selected Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl card-hover">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Monthly Spend</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
            {formatPrice(displayTotalMonthly, displayCurrency)}
            <span className="text-xs font-bold text-royal-purple-600 dark:text-royal-purple-400 bg-royal-purple-100 dark:bg-royal-purple-500/10 px-2 py-0.5 rounded-full border border-royal-purple-200 dark:border-royal-purple-500/20">
              {displayCurrency}
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">Real-time converted spend</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl card-hover">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Services</div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 flex items-baseline gap-2">
            {activeSubs.length} Subscriptions
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">{pausedSubs.length} paused or flagged</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl card-hover">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Monthly Savings Realized</div>
          <div className="text-3xl font-black text-royal-purple-600 dark:text-royal-purple-400 mt-2 flex items-baseline gap-2">
            {formatPrice(displayPausedSavings, displayCurrency)} / mo
          </div>
          <div className="mt-3 text-xs text-slate-500 font-medium">Saved via paused/canceled subs</div>
        </div>

        <div className="p-6 rounded-3xl bg-royal-purple-50 dark:bg-royal-purple-500/10 border border-royal-purple-200 dark:border-royal-purple-500/30 backdrop-blur-xl flex flex-col justify-center items-center text-center cursor-pointer hover:bg-royal-purple-100 dark:hover:bg-royal-purple-500/20 card-hover transition-all" onClick={handleForceSync}>
          <svg className={`w-8 h-8 text-royal-purple-600 dark:text-royal-purple-400 mb-2 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <div className="text-sm font-bold text-royal-purple-700 dark:text-royal-purple-300">{syncing ? 'Syncing...' : 'Sync Now'}</div>
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
          {STANDARD_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-royal-purple-600 text-white shadow-md shadow-royal-purple-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table / Empty State Container */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl overflow-visible relative z-10 shadow-2xl">
        
        {/* Table Control Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Subscriptions Portfolio
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Active commitments and upcoming renewals
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Status Filter Dropdown */}
            <div className="w-40 shrink-0">
              <CustomSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={STATUS_FILTER_OPTIONS}
                size="sm"
              />
            </div>

            {/* Multi-Format Export Dropdown */}
            <ExportMenu
              subscriptions={subscriptions}
              displayCurrency={displayCurrency}
              displayToast={displayToast}
            />

            {/* Add Subscription Button */}
            <button
              onClick={() => { setEditingSub(null); setIsAddModalOpen(true); }}
              className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-royal-purple-600 to-royal-purple-500 hover:from-royal-purple-500 hover:to-royal-purple-400 shadow-md shadow-royal-purple-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Subscription</span>
            </button>
          </div>
        </div>

        {/* Conditional Content: 0 Subscriptions Empty State vs Filtered Table vs Filter Empty State */}
        {(!subscriptions || subscriptions.length === 0) ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-royal-purple-50 dark:bg-royal-purple-500/10 border border-royal-purple-200 dark:border-royal-purple-500/30 flex items-center justify-center mb-5 text-royal-purple-600 dark:text-royal-purple-400 shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                No Subscriptions Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs">
                No subscriptions yet. Add your first subscription to start tracking your spending, renewal alerts, and budgets.
              </p>
              <button
                onClick={() => { setEditingSub(null); setIsAddModalOpen(true); }}
                className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-royal-purple-600 to-royal-purple-500 hover:from-royal-purple-500 hover:to-royal-purple-400 shadow-lg shadow-royal-purple-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Subscription</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-b-3xl">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
                <tr>
                  <th className="px-6 py-4">Subscription Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none" onClick={() => handleSort('price')}>
                    <div className="flex items-center gap-1">
                      Price / Billing
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
                {(sortedSubs || []).length > 0 ? (
                  (sortedSubs || []).map((sub) => {
                    if (!sub) return null;
                    const priceStr = String(sub?.price || '0');
                    const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                    const subCurr = sub?.currency || 'USD';
                    const convertedVal = convertCurrency(rawVal, subCurr, displayCurrency);

                    // Safe display for renewal date
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
                      <tr key={sub.id || sub._id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
                          <span className="font-bold text-slate-900 dark:text-white">{formatPrice(convertedVal, displayCurrency)}</span>
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
                            onClick={() => openEditModal(sub)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(sub.id || sub._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              sub.status === 'Paused'
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            {sub.status === 'Paused' ? 'Resume' : 'Pause'}
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: sub.id || sub._id, name: sub.name || sub.serviceName || 'Subscription' })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/20 hover:bg-rose-200 dark:hover:bg-rose-500/20 transition-all cursor-pointer"
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
                      <div className="flex flex-col items-center gap-2">
                        <span>No subscriptions match your search filter.</span>
                        <button
                          onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedStatus('All'); }}
                          className="text-xs font-bold text-royal-purple-600 dark:text-royal-purple-400 hover:underline cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
