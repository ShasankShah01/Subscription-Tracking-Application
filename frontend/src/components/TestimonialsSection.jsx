import React from 'react';

// DEV ONLY: sample feedback for local testing (disabled in production builds)
const DEV_SAMPLE_REVIEWS = import.meta.env.DEV ? [
  {
    name: 'Aarav Sharma',
    role: 'Computer Science Major',
    college: 'BITS Pilani',
    avatar: 'A',
    stars: 5,
    quote: 'STArt caught three unused free trial subscriptions I totally forgot about! Saved me over $45 in my very first month. The MERN stack UI is insanely smooth.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    name: 'Priya Patel',
    role: 'Product Designer & Freelancer',
    college: 'IIT Bombay',
    avatar: 'P',
    stars: 5,
    quote: 'The glassmorphic dashboard looks like a $100/mo enterprise SaaS. Managing Figma, Adobe, and AWS subscriptions in one clean hub is a game changer.',
    color: 'from-violet-500 to-pink-500',
  },
  {
    name: 'Rohan Verma',
    role: 'Full Stack Student Developer',
    college: 'Delhi Technological Univ',
    avatar: 'R',
    stars: 5,
    quote: 'Awesome project! Clean architecture, fast React frontend, and the automated renewal alerts give me peace of mind before my cloud bills hit.',
    color: 'from-emerald-500 to-teal-500',
  },
] : [];

export default function TestimonialsSection({ feedbackList = [] }) {
  // Only consume real live feedback in production; dev fallback gated strictly to DEV mode
  const reviews = feedbackList.length > 0 
    ? feedbackList 
    : (import.meta.env.DEV ? DEV_SAMPLE_REVIEWS : []);

  if (!reviews || reviews.length === 0) {
    return null;
  }
  return (
    <section id="testimonials" className="py-24 border-b border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
            User Feedback & Reviews
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Loved by Students & Developers
          </h2>
          <p className="text-zinc-400 text-lg">
            Here is what early adopters are saying about tracking their recurring expenses with STArt.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-zinc-900/40 border border-white/10 p-8 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1 group"
            >
              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-zinc-300 text-sm leading-relaxed mb-6 font-normal italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* User info */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${rev.color} flex items-center justify-center font-bold text-white shadow-md`}>
                  {rev.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{rev.name}</h4>
                  <p className="text-xs text-zinc-400">{rev.role} • {rev.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
