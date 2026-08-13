import React, { useState } from 'react';

const initialFeedbackList = [
  {
    id: 1,
    name: 'Aarav S.',
    role: 'Computer Science Major',
    rating: 5,
    message: 'Love the glassmorphic dashboard! Catching my forgotten trial subscriptions before they renewed saved me big time.',
    date: 'Aug 10, 2026',
    tag: 'Feature Request Approved',
  },
  {
    name: 'Priya P.',
    role: 'Design Student',
    rating: 5,
    message: 'The MERN stack responsiveness is super crisp. Great job making a 100% free utility tool for students!',
    date: 'Aug 12, 2026',
    tag: 'Verified Student',
  },
];

export default function FeedbackSection({ feedbackList, onAddFeedback }) {
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message || !authorName) return;

    onAddFeedback({
      id: Date.now(),
      name: authorName,
      role: role || 'Student User',
      rating: Number(rating),
      message: message,
      date: 'Just now',
      tag: 'New Feedback',
    });

    setAuthorName('');
    setRole('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const listToDisplay = feedbackList && feedbackList.length > 0 ? feedbackList : initialFeedbackList;

  return (
    <section id="feedback" className="py-24 border-b border-slate-800/60 relative overflow-hidden">
      {/* Background glow sphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-4">
            College Project Community
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Community & Project Feedback
          </h2>
          <p className="text-slate-400 text-lg">
            STArt is a 100% free, open project. Share your feedback, suggest features, or see what fellow students are saying.
          </p>
        </div>

        {/* Project Highlights Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg mb-3">
              100%
            </div>
            <h4 className="font-bold text-white text-base">Free & Open</h4>
            <p className="text-xs text-slate-400 mt-1">Built purely as a mini-project tool with zero commercial fees or paywalls.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
              MERN
            </div>
            <h4 className="font-bold text-white text-base">Full Stack Architecture</h4>
            <p className="text-xs text-slate-400 mt-1">MongoDB, Express, React 19, and Node.js working in sync.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg mb-3">
              0$
            </div>
            <h4 className="font-bold text-white text-base">No Subscriptions</h4>
            <p className="text-xs text-slate-400 mt-1">We track your subscriptions without ever charging you for ours.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-3">
              ⚡
            </div>
            <h4 className="font-bold text-white text-base">Instant Control</h4>
            <p className="text-xs text-slate-400 mt-1">Organize recurring expenses, due dates, and budgets seamlessly.</p>
          </div>
        </div>

        {/* Feedback Layout: Left Form + Right Live Board */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Submit Project Feedback</h3>
            <p className="text-xs text-slate-400 mb-6">
              Have a suggestion or bug report? Post it directly to the live community list.
            </p>

            {submitted && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-in fade-in">
                ✓ Thank you! Your feedback has been posted live.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Your Name / Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Role / Branch (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT Student / Beta Tester"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
                  <option value="3">⭐⭐⭐ Average (3/5)</option>
                  <option value="2">⭐⭐ Needs Improvement (2/5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Feedback / Feature Request
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share your thoughts on the UI, functionality, or suggested improvements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
              >
                Post Feedback
              </button>
            </form>
          </div>

          {/* Right Column: Live Board (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
              <span>Community Feedback Stream</span>
              <span className="text-xs text-cyan-400 font-mono font-normal">Live Updates</span>
            </h3>

            <div className="space-y-4">
              {listToDisplay.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">{item.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(item.rating)].map((_, i) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
