import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DashboardPreview from './components/DashboardPreview';
import FeaturesSection from './components/FeaturesSection';
import SavingsCalculator from './components/SavingsCalculator';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';

function App() {
  const [showToast, setShowToast] = useState(false);

  const handleDashboardClick = () => {
    setShowToast(true);
    // Automatically dismiss toast after 4.5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 4500);

    // Scroll smoothly to dashboard preview if triggered
    const el = document.getElementById('dashboard-preview');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification Popup */}
      {showToast && (
        <ToastNotification onClose={() => setShowToast(false)} />
      )}

      {/* Glassmorphic Navbar */}
      <Navbar onDashboardClick={handleDashboardClick} />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onDashboardClick={handleDashboardClick} />

        {/* Live Interactive Dashboard Preview */}
        <DashboardPreview onDashboardClick={handleDashboardClick} />

        {/* Feature Cards Grid */}
        <FeaturesSection />

        {/* Interactive Savings & Waste Calculator */}
        <SavingsCalculator onDashboardClick={handleDashboardClick} />

        {/* Transparent Pricing Options */}
        <PricingSection onDashboardClick={handleDashboardClick} />

        {/* Social Proof & Reviews */}
        <TestimonialsSection />

        {/* Bottom CTA Banner */}
        <CTASection onDashboardClick={handleDashboardClick} />
      </main>

      {/* Sleek Dark Footer */}
      <Footer />
    </div>
  );
}

export default App;
