import React, { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';
import { useAuth } from '../context/AuthContext';

const RATING_OPTIONS = [
  { value: 5, label: '⭐⭐⭐⭐⭐ Excellent (5/5)' },
  { value: 4, label: '⭐⭐⭐⭐ Good (4/5)' },
  { value: 3, label: '⭐⭐⭐ Average (3/5)' },
  { value: 2, label: '⭐⭐ Needs Improvement (2/5)' },
];

export default function FeedbackModal({ isOpen, onClose, feedbackList = [], onAddFeedback, user: propUser }) {
  const auth = useAuth();
  const currentUser = propUser || auth?.user;

  // Auto-fill logged in user's name or email, while keeping it fully editable
  const [authorName, setAuthorName] = useState(() => currentUser?.name || currentUser?.email || '');
  const [role, setRole] = useState(() => currentUser?.role || '');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill from authenticated user state on load or when modal opens, unless modified
  useEffect(() => {
    if (currentUser?.name || currentUser?.email) {
      setAuthorName(prev => (prev ? prev : (currentUser.name || currentUser.email)));
      if (currentUser.role) {
        setRole(prev => (prev ? prev : currentUser.role));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen && !authorName && (currentUser?.name || currentUser?.email)) {
      setAuthorName(currentUser.name || currentUser.email);
    }
  }, [isOpen, currentUser]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !authorName.trim()) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: authorName.trim(),
          role: role.trim() || 'App User',
          rating: Number(rating),
          message: message.trim(),
          tag: 'New Feedback',
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      const created = data.feedback || {
        _id: Date.now(),
        name: authorName,
        role: role || 'App User',
        rating: Number(rating),
        message,
        createdAt: new Date().toISOString(),
        tag: 'New Feedback',
      };

      if (onAddFeedback) {
        onAddFeedback({
          ...created,
          id: created._id || Date.now(),
          date: 'Just now',
        });
      }

      setAuthorName(currentUser?.name || currentUser?.email || '');
      setRole(currentUser?.role || '');
      setMessage('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Feedback submit error:', err);
      setErrorMsg(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const listToDisplay = feedbackList || [];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Blur + dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* Modal Panel — glassmorphism */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-zinc-950/90 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-t-3xl">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-[#F7E7CE] tracking-tight">
              Community Feedback
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Share your thoughts or feature requests with the STArt community.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-[#F7E7CE]/80 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close feedback modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/10">

          {/* Left: Submission Form (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">
              Submit Feedback
            </h3>

            {submitted && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold animate-in fade-in">
                ✓ Thank you! Your feedback has been posted.
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs font-bold animate-in fade-in">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Role / Branch (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT Student / Beta Tester"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Rating
                </label>
                <CustomSelect
                  value={rating}
                  onChange={(val) => setRating(Number(val))}
                  options={RATING_OPTIONS}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Feedback / Feature Request
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Share your thoughts on the UI, functionality, or improvements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-[#F7E7CE]/40 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-700 to-amber-500 hover:from-violet-600 hover:to-amber-400 shadow-lg shadow-violet-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
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

          {/* Right: Live Feed (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center justify-between">
              <span>Community Stream</span>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-normal">Live</span>
            </h3>

            {listToDisplay.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {listToDisplay.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/12 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-royal-purple-100 dark:bg-royal-purple-500/20 border border-royal-purple-200 dark:border-royal-purple-500/30 text-royal-purple-700 dark:text-royal-purple-300 flex items-center justify-center font-bold text-xs">
                          {item.name ? item.name.charAt(0) : '?'}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex text-amber-500 text-xs">
                          {[...Array(item.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{item.message}"
                    </p>

                    {item.tag && (
                      <div className="mt-2 inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/8 text-[10px] font-semibold text-royal-purple-600 dark:text-royal-purple-300">
                        {item.tag}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 min-h-[280px] my-auto">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xs">
                  No community feedback yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
