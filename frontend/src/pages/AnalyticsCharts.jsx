// AnalyticsCharts.jsx — lazy-loaded Recharts subcomponent
// This file is code-split via React.lazy() in AnalyticsView.jsx
// Recharts only loads when the Analytics page is first visited.
import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { formatPrice } from '../utils/currency';

const COLORS = [
  '#7c3aed', // royal-purple-600
  '#8b5cf6', // royal-purple-500
  '#a78bfa', // royal-purple-400
  '#eab308', // gold-500
  '#facc15', // gold-400
  '#10b981', // emerald-500
  '#0ea5e9', // sky-500
];

function CustomTooltip({ active, payload, displayCurrency }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs font-semibold">
        <p className="text-slate-600 dark:text-slate-300 mb-1">
          {payload[0].name || payload[0].payload?.name}
        </p>
        <p className="text-royal-purple-600 dark:text-royal-purple-400 font-bold">
          {formatPrice(payload[0].value, displayCurrency)}
        </p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsCharts({ type, data, displayCurrency }) {
  if (type === 'pie') {
    return data.length > 0 ? (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip displayCurrency={displayCurrency} />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontWeight: '600', color: '#64748b' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <div className="h-[300px] flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        No active subscriptions to analyze.
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:[stroke:#1e293b]" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val > 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(124, 58, 237, 0.05)' }}
              content={<CustomTooltip displayCurrency={displayCurrency} />}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? '#7c3aed' : COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
