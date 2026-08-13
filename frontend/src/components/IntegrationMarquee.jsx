import React from 'react';

const integrations = [
  { name: 'Netflix', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
  { name: 'AWS Cloud', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { name: 'Spotify', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { name: 'GitHub Pro', color: 'text-slate-200', bg: 'bg-slate-800 border-slate-700' },
  { name: 'Figma', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { name: 'ChatGPT Plus', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Adobe Creative', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { name: 'Notion', color: 'text-slate-100', bg: 'bg-slate-800 border-slate-700' },
  { name: 'DigitalOcean', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { name: 'Canva Pro', color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  { name: 'Vercel', color: 'text-slate-200', bg: 'bg-slate-900 border-slate-800' },
  { name: 'Slack Pro', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
];

export default function IntegrationMarquee() {
  return (
    <div className="w-full overflow-hidden py-8 bg-slate-950/80 border-y border-slate-800/80 backdrop-blur-md relative">
      {/* Side gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

      <div className="flex gap-4 items-center animate-marquee whitespace-nowrap">
        {/* Render twice for seamless infinite marquee loop */}
        {[...integrations, ...integrations].map((item, idx) => (
          <div
            key={idx}
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border backdrop-blur-xl transition-all ${item.bg}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
            <span className={`font-bold text-xs ${item.color}`}>{item.name}</span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Tracked</span>
          </div>
        ))}
      </div>
    </div>
  );
}
