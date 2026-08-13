import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { convertCurrency, formatPrice } from '../utils/currency';

export default function AnalyticsView({ subscriptions, displayCurrency }) {
  // 1. Spending by Category
  const categoryData = useMemo(() => {
    const activeSubs = subscriptions.filter(s => s.status !== 'Paused');
    const categories = {};
    activeSubs.forEach(sub => {
      const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
      const subCurr = sub.currency || 'USD';
      const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
      const monthlyUSD = sub.cycle === 'Yearly' ? valInUSD / 12 : valInUSD;
      categories[sub.category] = (categories[sub.category] || 0) + monthlyUSD;
    });

    return Object.keys(categories).map(key => ({
      name: key,
      value: convertCurrency(categories[key], 'USD', displayCurrency)
    })).sort((a, b) => b.value - a.value);
  }, [subscriptions, displayCurrency]);

  const COLORS = ['#0ea5e9', '#10b981', '#6366f1', '#f43f5e', '#a855f7', '#f59e0b', '#ec4899'];

  // 2. Upcoming Monthly Expenses (Simple 6-month projection)
  const projectionData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const data = [];
    
    // Static base cost of monthly active subs
    const activeSubs = subscriptions.filter(s => s.status !== 'Paused');
    let baseMonthlyUSD = 0;
    activeSubs.forEach(sub => {
      const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
      const subCurr = sub.currency || 'USD';
      const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
      if (sub.cycle === 'Monthly') {
        baseMonthlyUSD += valInUSD;
      }
    });

    for (let i = 0; i < 6; i++) {
      const mIdx = (currentMonthIdx + i) % 12;
      const monthLabel = months[mIdx];
      let projectedUSD = baseMonthlyUSD;

      // Add yearly subs that might trigger in this month (mocking - assuming equally distributed for this demo)
      activeSubs.forEach(sub => {
        if (sub.cycle === 'Yearly') {
          const rawVal = parseFloat(sub.price.replace(/[^0-9.]/g, '')) || 0;
          const valInUSD = convertCurrency(rawVal, sub.currency || 'USD', 'USD');
          // If the renewal date string contains this month
          if (sub.renewal.includes(monthLabel)) {
            projectedUSD += valInUSD;
          }
        }
      });

      data.push({
        name: monthLabel,
        amount: convertCurrency(projectedUSD, 'USD', displayCurrency)
      });
    }
    return data;
  }, [subscriptions, displayCurrency]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs font-semibold">
          <p className="text-slate-300 mb-1">{payload[0].name || payload[0].payload.name}</p>
          <p className="text-cyan-400 font-bold">
            {formatPrice(payload[0].value, displayCurrency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-black text-white">Financial Analytics</h2>
        <p className="text-sm text-slate-400">Insights into your subscription spending habits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Pie Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-slate-500">
              No active subscriptions to analyze.
            </div>
          )}
        </div>

        {/* Expenses Bar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-slate-300 mb-6 uppercase tracking-wider">Upcoming Monthly Expenses (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val > 1000 ? (val/1000).toFixed(1)+'k' : val}`} />
                <Tooltip cursor={{ fill: '#0f172a' }} content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {projectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#0ea5e9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
