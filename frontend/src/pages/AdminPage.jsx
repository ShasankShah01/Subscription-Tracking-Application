import React, { useState } from 'react';

const mockUsersList = [
  { id: 1, name: 'Shasank', email: 'shasank@start.app', country: 'India', currency: 'INR', role: 'Admin', joined: 'Aug 10, 2026' },
  { id: 2, name: 'Alex Morgan', email: 'alex@college.edu', country: 'United States', currency: 'USD', role: 'System Analyst', joined: 'Aug 11, 2026' },
  { id: 3, name: 'Aarav Sharma', email: 'aarav@bits.ac.in', country: 'India', currency: 'INR', role: 'User', joined: 'Aug 12, 2026' },
  { id: 4, name: 'Priya Patel', email: 'priya@iitb.ac.in', country: 'India', currency: 'INR', role: 'User', joined: 'Aug 12, 2026' },
  { id: 5, name: 'Emma Watson', email: 'emma@oxford.ac.uk', country: 'United Kingdom', currency: 'GBP', role: 'User', joined: 'Aug 13, 2026' },
];

export default function AdminPage({ user, onGoLanding, onGoDashboard }) {
  const [users, setUsers] = useState(mockUsersList);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // RBAC Access Check: Only 'Admin' or 'System Analyst'
  const isAuthorized = user && (user.role === 'Admin' || user.role === 'System Analyst');

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        showToast(`Updated ${u.name}'s role to ${newRole}`);
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-2xl font-black mb-4">
          🚫
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Access Denied (403 Forbidden)</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          The /admin route requires <strong>Admin</strong> or <strong>System Analyst</strong> privileges. Please log in with authorized credentials (e.g. Master Admin <code>Shasank</code>).
        </p>
        <button
          onClick={onGoLanding}
          className="px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-lg"
        >
          Return to Landing Page
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onGoDashboard}
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              My Workspace
            </button>

            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center font-black text-xl text-slate-950 shadow-md">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                ST<span className="text-cyan-400">Art</span> Platform Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              {user.role} Role
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Platform Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Registered Users</div>
            <div className="text-3xl font-black text-white mt-2">142 Accounts</div>
            <div className="mt-3 text-xs text-emerald-400 font-medium">+18 this week</div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Platform Subscriptions</div>
            <div className="text-3xl font-black text-cyan-400 mt-2">524 Entries</div>
            <div className="mt-3 text-xs text-slate-500 font-medium">84% active status</div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Tracked Volume</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">$14,850 / mo</div>
            <div className="mt-3 text-xs text-slate-500 font-medium">Platform-wide aggregate</div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">System Health & Engine</div>
            <div className="text-3xl font-black text-white mt-2 flex items-baseline gap-2">
              Optimal
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Uptime
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-500 font-medium">MERN Express & Mongo API</div>
          </div>
        </div>

        {/* User Management & RBAC Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Platform User Management & RBAC</h3>
              <p className="text-xs text-slate-400">View registered platform users and update access privileges.</p>
            </div>
            <div className="text-xs text-slate-500 font-mono font-medium">
              Master Admin: <strong className="text-cyan-400">Shasank (Shasank0110)</strong>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">User Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Country & Currency</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4 text-right">RBAC Role Switcher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white shadow-inner">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-bold text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">{u.email}</td>
                      <td className="px-6 py-4 text-xs text-slate-300">
                        {u.country} <span className="text-slate-500">({u.currency})</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">{u.joined}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          u.role === 'Admin'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : u.role === 'System Analyst'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-500"
                        >
                          <option value="User">User</option>
                          <option value="System Analyst">System Analyst</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
