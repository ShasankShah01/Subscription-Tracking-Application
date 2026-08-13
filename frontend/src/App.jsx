import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import AnalyticsView from './pages/AnalyticsView';
import TrialHubView from './pages/TrialHubView';
import SettingsView from './pages/SettingsView';
import AnalystPage from './pages/AnalystPage';
import DashboardLayout from './layouts/DashboardLayout';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ToastNotification from './components/ToastNotification';
import { getCurrencyByCountry } from './utils/currency';
import { ThemeProvider } from './context/ThemeContext';

const initialSubscriptions = [
  { id: 1, name: 'Netflix Premium', category: 'Entertainment', price: '$19.99', currency: 'USD', cycle: 'Monthly', status: 'Active', renewal: 'Aug 18, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 2, name: 'Spotify Student', category: 'Music', price: '$5.99', currency: 'USD', cycle: 'Monthly', status: 'Active', renewal: 'Aug 22, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 3, name: 'AWS Cloud Hosting', category: 'Infrastructure', price: '$42.50', currency: 'USD', cycle: 'Monthly', status: 'Active', renewal: 'Aug 16, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 4, name: 'Figma Professional', category: 'Design', price: '$15.00', currency: 'USD', cycle: 'Monthly', status: 'Active', renewal: 'Sep 01, 2026', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 5, name: 'ChatGPT Plus', category: 'AI Tools', price: '$20.00', currency: 'USD', cycle: 'Monthly', status: 'Trial', renewal: 'Sep 05, 2026', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 6, name: 'Gym Membership', category: 'Fitness', price: '$65.00', currency: 'USD', cycle: 'Monthly', status: 'Paused', renewal: 'Aug 29, 2026', color: 'bg-slate-800 text-slate-400 border-slate-700' },
];

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not allowed, redirect to their respective dashboard
    if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'System Analyst') return <Navigate to="/analyst-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function PublicRoute({ user, children }) {
  if (user) {
    if (user.role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'System Analyst') return <Navigate to="/analyst-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  const [user, setUser] = useState(null); // null | { name, email, country, preferredCurrency, role }
  const [displayCurrency, setDisplayCurrency] = useState('INR'); // Default currency for India
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check backend session on startup
  useEffect(() => {
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.preferredCurrency) {
            setDisplayCurrency(data.user.preferredCurrency);
          }
        }
      })
      .catch(() => {
        // Backend offline fallback - set default currency
        setDisplayCurrency('INR');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    if (userData.country) {
      const autoCurr = getCurrencyByCountry(userData.country);
      setDisplayCurrency(userData.preferredCurrency || autoCurr);
    }
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
  };

  const displayToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 3000);
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* Toast Notification */}
      {showToast && (
        <ToastNotification message={toastMessage} onClose={() => setShowToast(false)} />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Routes>
        {/* Public Route - Landing Page */}
        <Route 
          path="/" 
          element={
            <PublicRoute user={user}>
              <>
                <Navbar
                  currentView="landing"
                  user={user}
                  displayCurrency={displayCurrency}
                  setDisplayCurrency={setDisplayCurrency}
                  onLogout={handleLogout}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
                <LandingPage
                  feedbackList={feedbackList}
                  onAddFeedback={(newFeedback) => setFeedbackList([newFeedback, ...feedbackList])}
                />
              </>
            </PublicRoute>
          } 
        />

        {/* Authenticated Dashboard Layout (Users) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['User']}>
              <DashboardLayout user={user} displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage subscriptions={subscriptions} setSubscriptions={setSubscriptions} displayCurrency={displayCurrency} displayToast={displayToast} />} />
          <Route path="analytics" element={<AnalyticsView subscriptions={subscriptions} displayCurrency={displayCurrency} />} />
          <Route path="trial-hub" element={<TrialHubView subscriptions={subscriptions} setSubscriptions={setSubscriptions} displayCurrency={displayCurrency} displayToast={displayToast} />} />
          <Route path="settings" element={<SettingsView user={user} onLogout={handleLogout} displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} />} />
        </Route>

        {/* Authenticated Admin Layout */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['Admin']}>
              <DashboardLayout user={user} displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage user={user} />} />
        </Route>

        {/* Authenticated Analyst Layout */}
        <Route 
          path="/analyst-dashboard" 
          element={
            <ProtectedRoute user={user} allowedRoles={['System Analyst']}>
              <DashboardLayout user={user} displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AnalystPage user={user} />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
