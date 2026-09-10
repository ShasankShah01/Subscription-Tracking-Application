import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Floating ambient particle ────────────────────────────────────────────────
function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-pulse"
      style={style}
    />
  );
}

// ─── 404 Not Found Page ───────────────────────────────────────────────────────
export default function NotFoundPage() {
  const navigate = useNavigate();

  // Stable particle config (won't re-randomise on re-renders)
  const particles = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      size:   Math.random() * 70 + 15,
      top:    Math.random() * 100,
      left:   Math.random() * 100,
      delay:  Math.random() * 4,
      dur:    Math.random() * 3 + 2,
      opacity: (Math.random() * 0.12 + 0.04).toFixed(2),
      color:  i % 3 === 0 ? '#7c3aed' : i % 3 === 1 ? '#facc15' : '#8b5cf6',
    }))
  );

  // Set a contextual page title while on this route
  useEffect(() => {
    const prev = document.title;
    document.title = '404 — Page Not Found | STArt';
    return () => { document.title = prev; };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">

      {/* ── Ambient glow orbs ───────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Floating particles ──────────────────────────────────────────────── */}
      {particles.current.map(p => (
        <Particle
          key={p.id}
          style={{
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            top:               `${p.top}%`,
            left:              `${p.left}%`,
            background:        p.color,
            opacity:           p.opacity,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}

      {/* ── Subtle grid texture overlay ─────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Main card ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full mx-4">

        {/* Brand logomark */}
        <div className="mb-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl select-none"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)' }}>
          <span className="text-3xl font-black text-white tracking-tighter">S</span>
        </div>

        {/* ── Giant "404" with gradient + depth echo ─────────────────────── */}
        <div className="relative mb-2 select-none leading-none">
          {/* Depth / glow shadow layer */}
          <p
            aria-hidden="true"
            className="absolute inset-0 text-[9rem] sm:text-[11rem] font-black tracking-tighter blur-md pointer-events-none"
            style={{ color: 'rgba(124,58,237,0.25)' }}
          >
            404
          </p>

          {/* Primary gradient text */}
          <p
            className="relative text-[9rem] sm:text-[11rem] font-black tracking-tighter text-transparent bg-clip-text leading-none"
            style={{
              backgroundImage: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 45%, #facc15 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            404
          </p>
        </div>

        {/* Gradient divider */}
        <div className="w-20 h-px mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }}
        />

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
          This page doesn't exist
        </h1>

        {/* Body copy */}
        <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-sm" style={{ color: '#94a3b8' }}>
          The route you followed has gone missing — or maybe it never existed at all.
          Let's get you back to managing your subscriptions.
        </p>

        {/* ── Primary CTA ─────────────────────────────────────────────────── */}
        <button
          id="not-found-go-home-btn"
          onClick={() => navigate('/', { replace: true })}
          className="
            group relative inline-flex items-center gap-2.5
            px-8 py-3.5 rounded-xl font-semibold text-sm text-white
            overflow-hidden transition-all duration-200
            active:scale-95 hover:scale-[1.02]
          "
          style={{ background: 'linear-gradient(135deg, #6d28d9, #7c3aed)' }}
        >
          {/* Hover shimmer */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="relative">Back to Home</span>
        </button>

        {/* Footer attribution */}
        <p className="mt-12 text-xs" style={{ color: '#334155' }}>
          STArt &mdash; Subscription Tracking Application
        </p>
      </div>
    </div>
  );
}
