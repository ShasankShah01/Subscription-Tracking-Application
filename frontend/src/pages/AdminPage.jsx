import React, { useState, useEffect, useRef } from 'react';
import CustomSelect from '../components/CustomSelect';

const ROLE_OPTIONS = [
  { value: 'User', label: 'User' },
  { value: 'System Analyst', label: 'System Analyst' },
  { value: 'Admin', label: 'Admin' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function exportAuditLogCSV(users, stats) {
  const header = [
    'Name', 'Email', 'Role', 'Country', 'Currency',
    'Suspended', 'Joined', 'Total Users', 'Total Subs',
    'Global MRR', 'System Status', 'Uptime (h)',
  ];

  const userRows = users.map((u) => [
    u.name,
    u.email,
    u.role,
    u.country,
    u.preferredCurrency,
    u.isSuspended ? 'Yes' : 'No',
    new Date(u.createdAt).toLocaleDateString(),
    stats.totalUsers,
    stats.totalSubscriptions,
    `$${stats.globalMRR?.toFixed(2) ?? '0.00'}`,
    stats.systemStatus,
    (stats.uptime / 3600).toFixed(2),
  ]);

  const csvContent = [header, ...userRows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `STArt_GlobalAuditLog_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// ─── Action Dropdown per Row ────────────────────────────────────────────────

function ActionMenu({ u, onRoleChange, onSuspend, onForceReset, onViewData, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isMaster = u.email.toLowerCase() === 'shasankshah.25.mca@iite.indusuni.ac.in';

  const btnClass = 'w-full text-left px-3 py-2 text-xs font-semibold transition-colors flex items-center gap-2';

  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      {/* Role selector stays visible */}
      <div className="w-36">
        <CustomSelect
          value={u.role}
          onChange={(val) => onRoleChange(u._id, val)}
          options={ROLE_OPTIONS}
          disabled={isMaster}
          size="sm"
        />
      </div>

      {/* Actions kebab button */}
      <button
        onClick={() => setOpen(!open)}
        disabled={isMaster}
        className="px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-40"
        title="More actions"
      >
        ⋯
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => { onSuspend(u._id, u.isSuspended); setOpen(false); }}
            className={`${btnClass} ${u.isSuspended
              ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
              : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}
          >
            <span>{u.isSuspended ? '🔓' : '🔒'}</span>
            {u.isSuspended ? 'Reinstate Account' : 'Suspend Account'}
          </button>

          <button
            onClick={() => { onForceReset(u._id, u.email); setOpen(false); }}
            className={`${btnClass} text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10`}
          >
            <span>🔑</span> Force Password Reset
          </button>

          <button
            onClick={() => { onViewData(u); setOpen(false); }}
            className={`${btnClass} text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10`}
          >
            <span>🗂️</span> View User Data
          </button>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

          <button
            onClick={() => { onDelete(u); setOpen(false); }}
            className={`${btnClass} text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10`}
          >
            <span>🗑️</span> Delete User
          </button>
        </div>
      )}
    </div>
  );
}

// ─── View User Data Modal ────────────────────────────────────────────────────

function UserDataModal({ targetUser, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetUser) return;
    fetch(`http://localhost:5000/api/admin/users/${targetUser._id}/subscriptions`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [targetUser]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Data Inspector</h3>
            <p className="text-xs text-slate-500 mt-0.5">{targetUser.name} · {targetUser.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">Loading subscriptions…</div>
          ) : !data?.subscriptions?.length ? (
            <div className="text-center py-8 text-slate-400 text-sm">This user has no tracked subscriptions.</div>
          ) : (
            <div className="space-y-2">
              {data.subscriptions.map((sub) => (
                <div key={sub._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{sub.serviceName}</div>
                    <div className="text-xs text-slate-500">{sub.category} · {sub.billingCycle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{sub.currency} {sub.cost}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'Active' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                    }`}>{sub.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirmation Modal ───────────────────────────────────────────────

function DeleteModal({ targetUser, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/10 dark:bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete User?</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Permanently delete <strong>{targetUser.name}</strong> ({targetUser.email}) and all their subscription data? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/20 transition-all">Delete Permanently</button>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 backdrop-blur-xl shadow-sm dark:shadow-none transition-theme">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-black mt-2 ${accent || 'text-slate-800 dark:text-slate-100'}`}>{value}</div>
      {sub && <div className="mt-2 text-xs text-slate-500 dark:text-slate-500 font-medium">{sub}</div>}
    </div>
  );
}

// ─── Main AdminPage ──────────────────────────────────────────────────────────

export default function AdminPage({ user }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0, totalSubscriptions: 0, activeSubscriptions: 0,
    pausedSubscriptions: 0, suspendedUsers: 0,
    rolesCount: { Admin: 0, SystemAnalyst: 0, User: 0 },
    globalMRR: 0, topService: { name: 'N/A', count: 0 },
    systemStatus: 'Optimal', uptime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Modal states
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToInspect, setUserToInspect] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/users', { credentials: 'include' }),
        fetch('http://localhost:5000/api/admin/stats', { credentials: 'include' }),
      ]);
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();
      if (usersData.success) setUsers(usersData.users);
      if (statsData.success) setStats(statsData.stats);
    } catch {
      showToast('⚠️ Error loading platform data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRoleChange = async (userId, newRole) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    showToast(res.ok ? `✅ Role updated to ${newRole}` : data.message || 'Error updating role');
    if (res.ok) fetchData();
  };

  const handleSuspend = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/suspend`, { method: 'PUT', credentials: 'include' });
    const data = await res.json();
    showToast(res.ok ? `✅ ${data.message}` : data.message || 'Error');
    if (res.ok) fetchData();
  };

  const handleForceReset = async (userId) => {
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/force-reset`, { method: 'PUT', credentials: 'include' });
    const data = await res.json();
    showToast(res.ok ? `✅ ${data.message}` : data.message || 'Error');
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    const res = await fetch(`http://localhost:5000/api/admin/users/${userToDelete._id}`, { method: 'DELETE', credentials: 'include' });
    const data = await res.json();
    showToast(res.ok ? `✅ ${data.message}` : data.message || 'Error deleting user');
    if (res.ok) fetchData();
    setUserToDelete(null);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Inline Toast ─────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-300 dark:border-cyan-500/40 text-slate-900 dark:text-white text-xs font-bold shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-ping" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {userToDelete && (
        <DeleteModal
          targetUser={userToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setUserToDelete(null)}
        />
      )}
      {userToInspect && (
        <UserDataModal
          targetUser={userToInspect}
          onClose={() => setUserToInspect(null)}
        />
      )}

      {/* ── Page Title ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Platform Admin
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold align-middle">
              {user?.role}
            </span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Real-time platform statistics, RBAC controls, and global administration.</p>
        </div>
        <button
          onClick={() => exportAuditLogCSV(users, stats)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export Audit Log
        </button>
      </div>

      {/* ── KPI Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={`${stats.totalUsers} Accounts`} sub={`${stats.suspendedUsers} suspended`} />
        <StatCard label="Platform Subscriptions" value={`${stats.totalSubscriptions} Entries`} sub={`${stats.activeSubscriptions} active`} accent="text-cyan-600 dark:text-cyan-400" />
        <StatCard
          label="Global MRR"
          value={`$${(stats.globalMRR ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sub="Platform-wide monthly revenue"
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Top Tracked Service"
          value={stats.topService?.name ?? 'N/A'}
          sub={`${stats.topService?.count ?? 0} active users`}
          accent="text-purple-600 dark:text-purple-400"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Admins" value={stats.rolesCount.Admin} accent="text-cyan-600 dark:text-cyan-400" />
        <StatCard label="System Analysts" value={stats.rolesCount.SystemAnalyst} accent="text-purple-600 dark:text-purple-400" />
        <StatCard label="Standard Users" value={stats.rolesCount.User} />
        <StatCard
          label="System Health"
          value={stats.systemStatus}
          sub={`${(stats.uptime / 3600).toFixed(1)}h uptime · MERN Engine`}
          accent="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* ── Platform Controls ─────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 transition-theme">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Platform Controls</h3>
        <p className="text-xs text-slate-500 mb-5">Global switches that affect the entire platform environment.</p>

        <div className="flex flex-wrap gap-4">
          {/* Maintenance Mode Toggle */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 flex-1 min-w-[260px]">
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white">Maintenance Mode</div>
              <div className="text-xs text-slate-500 mt-0.5">
                {maintenanceMode
                  ? '🔴 Active — non-admin users are locked out'
                  : '🟢 Inactive — platform is fully operational'}
              </div>
            </div>
            <button
              onClick={() => { setMaintenanceMode(!maintenanceMode); showToast(maintenanceMode ? '✅ Maintenance mode disabled' : '⚠️ Maintenance mode ENABLED'); }}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${maintenanceMode ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              role="switch"
              aria-checked={maintenanceMode}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Export Audit Log */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 flex-1 min-w-[260px]">
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900 dark:text-white">Export Global Audit Log</div>
              <div className="text-xs text-slate-500 mt-0.5">Downloads all users + system health as a CSV file.</div>
            </div>
            <button
              onClick={() => { exportAuditLogCSV(users, stats); showToast('✅ Audit log exported!'); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 transition-all"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* ── User Management Table ─────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">User Management & RBAC</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage access privileges, suspend accounts, and inspect user data.</p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Master Admin: <strong className="text-cyan-600 dark:text-cyan-400">Shasank Shah</strong>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/8">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status & Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-medium">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-sm">Loading platform data…</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-sm">No users found.</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${u.isSuspended ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 font-mono">{u.email}</td>
                      <td className="px-6 py-4 text-xs">{u.country} <span className="text-slate-400">({u.preferredCurrency})</span></td>
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border w-fit ${
                            u.isSuspended
                              ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30'
                              : u.role === 'Admin'
                              ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40'
                              : u.role === 'System Analyst'
                              ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                          }`}>
                            {u.isSuspended ? '🔒 Suspended' : u.role}
                          </span>
                          {u.passwordResetRequested && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30 w-fit">
                              🔑 Reset Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <ActionMenu
                            u={u}
                            onRoleChange={handleRoleChange}
                            onSuspend={handleSuspend}
                            onForceReset={handleForceReset}
                            onViewData={setUserToInspect}
                            onDelete={setUserToDelete}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
