import React, { useMemo, lazy, Suspense } from 'react';
import { convertCurrency, formatPrice } from '../utils/currency';

// ── Code-split Recharts: lazy-load the entire charts subcomponent ─────────────
// This keeps the initial dashboard bundle lightweight.
const AnalyticsCharts = lazy(() => import('./AnalyticsCharts'));

// Skeleton loader shown while Recharts chunk loads
function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full flex flex-col gap-4 animate-pulse p-2">
      <div className="h-4 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="flex-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
    </div>
  );
}

export default function AnalyticsView({ subscriptions = [], displayCurrency = 'USD' }) {
  // 1. Spending by Category
  const categoryData = useMemo(() => {
    const activeSubs = (subscriptions || []).filter(s => s && s.status !== 'Paused');
    const categories = {};
    activeSubs.forEach(sub => {
      const priceStr = String(sub?.price || '0');
      const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const subCurr = sub?.currency || 'USD';
      const valInUSD = convertCurrency(rawVal, subCurr, 'USD');
      const monthlyUSD = sub?.cycle === 'Yearly' ? valInUSD / 12 : valInUSD;
      const catKey = String(sub?.category || 'General');
      categories[catKey] = (categories[catKey] || 0) + monthlyUSD;
    });

    return Object.keys(categories).map(key => ({
      name: key,
      value: convertCurrency(categories[key], 'USD', displayCurrency),
    })).sort((a, b) => b.value - a.value);
  }, [subscriptions, displayCurrency]);

  // 2. Upcoming Monthly Expenses (6-month projection)
  const projectionData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const data = [];

    const activeSubs = (subscriptions || []).filter(s => s && s.status !== 'Paused');
    let baseMonthlyUSD = 0;
    activeSubs.forEach(sub => {
      const priceStr = String(sub?.price || '0');
      const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      const valInUSD = convertCurrency(rawVal, sub?.currency || 'USD', 'USD');
      if (sub?.cycle === 'Monthly') baseMonthlyUSD += valInUSD;
    });

    for (let i = 0; i < 6; i++) {
      const mIdx = (currentMonthIdx + i) % 12;
      const monthLabel = months[mIdx];
      let projectedUSD = baseMonthlyUSD;

      activeSubs.forEach(sub => {
        if (sub?.cycle === 'Yearly') {
          const priceStr = String(sub?.price || '0');
          const rawVal = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
          const valInUSD = convertCurrency(rawVal, sub?.currency || 'USD', 'USD');
          const renewalStr = String(sub?.renewal || '');
          if (renewalStr.includes(monthLabel)) {
            projectedUSD += valInUSD;
          }
        }
      });

      data.push({
        name: monthLabel,
        amount: convertCurrency(projectedUSD, 'USD', displayCurrency),
      });
    }
    return data;
  }, [subscriptions, displayCurrency]);

  // Summary stat cards
  const activeSubs = (subscriptions || []).filter(s => s && s.status === 'Active');
  const totalSpend = activeSubs.reduce((acc, sub) => {
    const priceStr = String(sub?.price || '0');
    const raw = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    const usd = convertCurrency(raw, sub?.currency || 'USD', 'USD');
    return acc + (sub?.cycle === 'Yearly' ? usd / 12 : usd);
  }, 0);
  const displayTotal = convertCurrency(totalSpend, 'USD', displayCurrency);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Financial Analytics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Insights into your subscription spending habits.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Monthly Spend',
            value: formatPrice(displayTotal, displayCurrency),
            sub: `${displayCurrency} — active only`,
            accent: 'text-royal-purple-600 dark:text-royal-purple-400',
            border: 'hover:border-royal-purple-300 dark:hover:border-royal-purple-500/30',
          },
          {
            label: 'Active Subscriptions',
            value: activeSubs.length,
            sub: `${subscriptions.filter(s => s.status === 'Trial').length} in trial`,
            accent: 'text-emerald-600 dark:text-emerald-400',
            border: 'hover:border-emerald-300 dark:hover:border-emerald-500/30',
          },
          {
            label: 'Spending Categories',
            value: categoryData.length,
            sub: 'distinct categories tracked',
            accent: 'text-gold-600 dark:text-gold-400',
            border: 'hover:border-gold-300 dark:hover:border-gold-500/30',
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl card-hover transition-colors ${card.border}`}
          >
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {card.label}
            </div>
            <div className={`text-3xl font-black mt-2 ${card.accent}`}>{card.value}</div>
            <div className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts — lazy loaded */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl card-hover">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-wider">
            Spending by Category
          </h3>
          <Suspense fallback={<ChartSkeleton />}>
            <AnalyticsCharts
              type="pie"
              data={categoryData}
              displayCurrency={displayCurrency}
            />
          </Suspense>
        </div>

        {/* Monthly Projection Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl card-hover">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 uppercase tracking-wider">
            Upcoming Monthly Expenses (6 Months)
          </h3>
          <Suspense fallback={<ChartSkeleton />}>
            <AnalyticsCharts
              type="bar"
              data={projectionData}
              displayCurrency={displayCurrency}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
