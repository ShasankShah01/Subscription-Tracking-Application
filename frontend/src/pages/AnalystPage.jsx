import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#06b6d4', '#10b981', '#a855f7', '#f43f5e', '#f59e0b', '#3b82f6'];

const mockGrowthData = [
  { name: 'Jan', users: 40, subs: 24 },
  { name: 'Feb', users: 50, subs: 48 },
  { name: 'Mar', users: 65, subs: 80 },
  { name: 'Apr', users: 80, subs: 120 },
  { name: 'May', users: 110, subs: 180 },
  { name: 'Jun', users: 142, subs: 524 },
];

const mockCategoryData = [
  { name: 'Entertainment', value: 240 },
  { name: 'Infrastructure', value: 120 },
  { name: 'AI Tools', value: 80 },
  { name: 'Design', value: 50 },
  { name: 'Others', value: 34 },
];

const mockLogs = [
  { id: 1, time: '10:42 AM', user: 'Shasank', action: 'System Backup Completed', type: 'system' },
  { id: 2, time: '10:35 AM', user: 'Alex M.', action: 'Exported User Report', type: 'info' },
  { id: 3, time: '10:15 AM', user: 'System', action: 'High CPU Load Detected', type: 'warning' },
  { id: 4, time: '09:50 AM', user: 'Emma W.', action: 'Upgraded to Premium', type: 'success' },
];

export default function AnalystPage({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    pausedSubscriptions: 0,
    rolesCount: { Admin: 0, SystemAnalyst: 0, User: 0 },
    systemStatus: 'Optimal',
    uptime: 0,
  });

  const [logs, setLogs] = useState(mockLogs);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching analyst data:', error);
      }
    };
    fetchData();

    // Simulate live logs
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: ['System', 'API', 'Webhook', 'Sync'][Math.floor(Math.random() * 4)],
          action: ['Data sync complete', 'Token refreshed', 'Database ping 12ms', 'Cache cleared'][Math.floor(Math.random() * 4)],
          type: ['info', 'success', 'system'][Math.floor(Math.random() * 3)]
        };
        return [newLog, ...prev].slice(0, 8); // Keep last 8
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">System Analyst Dashboard</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">Read-only view of platform metrics, growth charts, and system health.</p>
      </div>

      {/* Platform Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Registered Users</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{stats.totalUsers} Accounts</div>
          <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">+18 this week</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Platform Subscriptions</div>
          <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-2">{stats.totalSubscriptions} Entries</div>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-500 font-medium">{stats.activeSubscriptions} active subscriptions</div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">User Roles</div>
          <div className="text-xl font-bold text-slate-700 dark:text-purple-400 mt-2 flex flex-col gap-1">
            <span className="text-sm">Admin: {stats.rolesCount.Admin}</span>
            <span className="text-sm">Analyst: {stats.rolesCount.SystemAnalyst}</span>
            <span className="text-sm">User: {stats.rolesCount.User}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">System Health & Engine</div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
            {stats.systemStatus}
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/20">
              {(stats.uptime / 3600).toFixed(1)}h
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600 dark:text-slate-500 font-medium">MERN Express & Mongo API</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">User & Subscription Growth</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickMargin={10} />
                <YAxis stroke="#64748b" fontSize={12} tickMargin={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="users" name="Users" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="subs" name="Subscriptions" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Subscription Categories</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="middle" layout="vertical" align="right" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Activity Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Live Activity Log
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </h3>
        </div>
        
        <div className="space-y-3">
          {logs.map((log) => {
            let badgeColor = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
            if (log.type === 'success') badgeColor = 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
            if (log.type === 'warning') badgeColor = 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
            if (log.type === 'info') badgeColor = 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400';

            return (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                    {log.type}
                  </span>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white mr-2">{log.action}</span>
                    <span className="text-xs text-slate-500">by {log.user}</span>
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-400">{log.time}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed bg-slate-50 dark:bg-slate-900/30 text-center flex flex-col items-center transition-colors">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Restricted Access</h4>
        <p className="text-xs text-slate-500 max-w-sm">As a System Analyst, you have read-only access to platform metrics. User management and RBAC updates are restricted to Administrators.</p>
      </div>
    </div>
  );
}
