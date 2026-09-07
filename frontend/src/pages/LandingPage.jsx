import React from 'react';
import HeroSection from '../components/HeroSection';
import IntegrationMarquee from '../components/IntegrationMarquee';
import BentoFeatures from '../components/BentoFeatures';
import SavingsCalculator from '../components/SavingsCalculator';
import FeedbackSection from '../components/FeedbackSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function LandingPage({ feedbackList, onAddFeedback }) {

  const handleGoDashboard = () => {
    // This prop used to handle state routing. 
    // Now it's handled by routing, but the CTA buttons on the landing page might still want to trigger the auth modal.
    // If they aren't authenticated, the Navbar handles that. 
    // Since LandingPage only renders if unauthenticated (PublicRoute), the CTA can just prompt login.
    // We can dispatch an event or just let them click 'Sign In' in the Navbar.
    // For now, we'll scroll to top as a placeholder action for these CTAs.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden">
      
      {/* Background Aurora Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-[10%] left-[25%] w-[650px] h-[650px] bg-violet-600/10 rounded-full blur-[170px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection onDashboardClick={handleGoDashboard} />

        {/* Integration Logo Marquee */}
        <IntegrationMarquee />

        {/* Bento Box Asymmetrical Features Grid */}
        <BentoFeatures />

        {/* Financial ROI Savings Calculator */}
        <SavingsCalculator onDashboardClick={handleGoDashboard} />

        {/* Community & Project Feedback Section */}
        <FeedbackSection feedbackList={feedbackList} onAddFeedback={onAddFeedback} />

        {/* Bottom CTA Banner */}
        <CTASection onDashboardClick={handleGoDashboard} />

        {/* Footer */}
        <Footer onGoLanding={() => window.scrollTo({ top: 0, behavior: 'smooth' })} onGoDashboard={handleGoDashboard} />
      </div>
    </div>
  );
}
