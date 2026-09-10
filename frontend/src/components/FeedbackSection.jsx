import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function FeedbackSection({ feedbackList = [], onAddFeedback, user: propUser }) {
  const auth = useAuth();
  const currentUser = propUser || auth?.user;

  // Form State
  const [authorName, setAuthorName] = useState(() => currentUser?.name || currentUser?.email || '');
  const [feedbackType, setFeedbackType] = useState('General');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill when authenticated user state loads, unless modified
  useEffect(() => {
    if (currentUser?.name || currentUser?.email) {
      setAuthorName(prev => (prev ? prev : (currentUser.name || currentUser.email)));
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedName = isAnonymous ? (authorName.trim() || 'Anonymous') : authorName.trim();
    if (!message.trim() || !resolvedName) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: resolvedName,
        role: feedbackType,
        rating: Number(rating),
        message: message.trim(),
        feedback: message.trim(),
        tag: feedbackType,
        feedbackType,
        isAnonymous,
      };

      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to post feedback');
      }

      const created = data.feedback || {
        _id: Date.now(),
        name: resolvedName,
        role: feedbackType,
        rating: Number(rating),
        message: message,
        feedbackType,
        isAnonymous,
        createdAt: new Date().toISOString(),
        tag: feedbackType,
      };

      if (onAddFeedback) {
        onAddFeedback({
          ...created,
          id: created._id || Date.now(),
          date: 'Just now',
        });
      }

      setAuthorName(currentUser?.name || currentUser?.email || '');
      setMessage('');
      setRating(5);
      setHoverRating(0);
      setFeedbackType('General');
      setIsAnonymous(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMsg(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Only display genuine, live feedback entries; discard any mock/sample/demo entries
  const listToDisplay = (feedbackList || []).filter(item => {
    if (!item) return false;
    if (item.isSample || item.isDemo || item.mock) return false;
    const name = (item.name || '').toLowerCase().trim();
    if (name === 'alex morgan' || name === 'alex morgen' || name === 'sarah jenkins') return false;
    return true;
  });

  return (
    <section id="feedback" className="py-24 border-b border-slate-200 dark:border-white/10 relative overflow-hidden bg-white dark:bg-[#050505]">
      {/* Background glow sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/10 dark:bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 dark:bg-amber-500/10 border border-violet-500/20 dark:border-amber-400/20 text-xs font-bold text-violet-700 dark:text-[#F7E7CE] mb-4">
            College Project Community
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Community & Project Feedback
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            STArt is a 100% free, open project. Share your feedback, suggest features, or see what fellow students are saying.
          </p>
        </div>

        {/* Project Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg mb-3">
              100%
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Free & Open</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Built purely as a mini-project tool with zero commercial fees or paywalls.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg mb-3">
              MERN
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Full Stack Architecture</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">MongoDB, Express, React 19, and Node.js working in sync.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg mb-3">
              0$
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">No Subscriptions</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We track your subscriptions without ever charging you for ours.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 backdrop-blur-2xl shadow-sm dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg mb-3">
              ⚡
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Instant Control</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organize recurring expenses, due dates, and budgets seamlessly.</p>
          </div>
        </div>

        {/* Feedback Layout: Left Form + Right Live Board */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Submit Project Feedback</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Have a suggestion or bug report? Post it directly to the live community list.
            </p>

            {submitted && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-in fade-in">
                ✓ Thank you! Your feedback has been posted live.
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-in fade-in">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phase 3: Anonymous Redaction Blur Toggle + Name Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Your Name / Handle
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Hide identity
                    </span>
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`w-9 h-5 rounded-full transition-colors duration-200 peer-focus:outline-none ${
                        isAnonymous
                          ? 'bg-indigo-500'
                          : 'bg-slate-200 dark:bg-slate-700'
                      } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all ${
                        isAnonymous ? 'after:translate-x-4' : ''
                      }`} />
                    </div>
                  </label>
                </div>
                <input
                  type="text"
                  required={!isAnonymous}
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? "Anonymous User" : "Your name or handle"}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all ${
                    isAnonymous ? 'blur-sm select-none opacity-50 pointer-events-none' : ''
                  }`}
                />
              </div>

              {/* Phase 1: Feedback Type Pill Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Feedback Type
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'Bug Report', label: '🐛 Bug Report' },
                    { id: 'Feature Request', label: '✨ Feature Request' },
                    { id: 'General', label: '💬 General' },
                  ].map((pill) => {
                    const isActive = feedbackType === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setFeedbackType(pill.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {pill.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phase 2: Interactive SVG Star Rating */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Rating
                  </label>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {(hoverRating || rating)} / 5
                  </span>
                </div>
                <div
                  className="flex items-center gap-1.5"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const currentRating = hoverRating || rating;
                    const isFilled = star <= currentRating;
                    const isSingleStar = currentRating === 1;

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        className="p-0.5 rounded-lg focus:outline-none cursor-pointer transition-transform hover:scale-110 active:scale-95"
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                      >
                        <svg
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            isFilled
                              ? isSingleStar
                                ? 'text-rose-500 fill-rose-500'
                                : 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-700 fill-slate-200/40 dark:fill-slate-800/40'
                          }`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Textarea Placeholder based on rating */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Feedback / Feature Request
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder={
                    rating === 1
                      ? "We're sorry you had a bad experience. What specifically went wrong?"
                      : "Share your thoughts on the UI, functionality, or improvements..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-700 to-amber-500 hover:from-violet-600 hover:to-amber-400 shadow-md shadow-violet-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Posting Feedback...</span>
                  </>
                ) : (
                  'Post Feedback'
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Board (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              <span>Community Feedback Stream</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-normal">Live Updates</span>
            </h3>

            {listToDisplay.length > 0 ? (
              <div className="space-y-4">
                {listToDisplay.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                          {item.name ? item.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{item.name}</h4>
                          <p className="text-[11px] text-slate-400">{item.role}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex text-amber-400 text-xs">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">{item.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{item.message}"
                    </p>

                    {item.tag && (
                      <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] font-semibold text-cyan-400">
                        {item.tag}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-zinc-900/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-base font-medium text-slate-600 dark:text-slate-300 mb-1">
                  No feedback yet
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  Currently no feedback. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
