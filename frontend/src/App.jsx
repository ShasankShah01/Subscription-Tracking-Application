import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Eager imports — on the critical rendering path ───────────────────────────
import LandingPage    from './pages/LandingPage';
import NotFoundPage   from './pages/NotFoundPage';
import Navbar         from './components/Navbar';
import AuthModal      from './components/AuthModal';
import ToastNotification from './components/ToastNotification';
import ErrorBoundary  from './components/ErrorBoundary';
import { getCurrencyByCountry } from './utils/currency';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { apiFetch }   from './utils/api';

// ── Lazy imports — loaded only after authentication ──────────────────────────
const DashboardPage   = lazy(() => import('./pages/DashboardPage'));
const AdminPage       = lazy(() => import('./pages/AdminPage'));
const AnalyticsView   = lazy(() => import('./pages/AnalyticsView'));
const TrialHubView    = lazy(() => import('./pages/TrialHubView'));
const SettingsView    = lazy(() => import('./pages/SettingsView'));
const AnalystPage     = lazy(() => import('./pages/AnalystPage'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// ── Shared Suspense fallback ─────────────────────────────────────────────────
function RouteLoader() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B1120] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-violet-400 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-violet-500/30 animate-pulse">
          S
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading STArt...</p>
      </div>
    </div>
  );
}


// ── RBAC Route Guards ────────────────────────────────────────
function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
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

// ─────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);
  const [displayCurrency, setDisplayCurrency] = useState('INR');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  // Start with an empty array — real data only, no hardcoded dummy subscriptions
  const [subscriptions, setSubscriptions] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check backend session and load feedback on startup
  useEffect(() => {
    // 1. Fetch community feedback
    fetch('http://localhost:5000/api/feedback')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.feedbacks) {
          setFeedbackList(data.feedbacks.map(f => ({
            ...f,
            id: f._id || f.id,
            date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Recent',
          })));
        }
      })
      .catch(err => console.warn('Could not fetch community feedback:', err));

    // 2. Check auth session
    fetch('http://localhost:5000/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
          if (data.user.preferredCurrency) {
            setDisplayCurrency(data.user.preferredCurrency);
          }
          // Fetch user's stored subscriptions from MongoDB
          apiFetch('/subscriptions')
            .then(subRes => {
              if (subRes.ok && subRes.data?.subscriptions) {
                setSubscriptions(subRes.data.subscriptions.map(s => ({ ...s, id: s._id || s.id })));
              }
            })
            .catch(err => console.warn('Could not pre-fetch subscriptions:', err));
        }
      })
      .catch(() => {
        // Backend offline fallback
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
    // Fetch user's stored subscriptions from MongoDB on login
    apiFetch('/subscriptions')
      .then(subRes => {
        if (subRes.ok && subRes.data?.subscriptions) {
          setSubscriptions(subRes.data.subscriptions.map(s => ({ ...s, id: s._id || s.id })));
        }
      })
      .catch(err => console.warn('Could not fetch subscriptions on login:', err));
  };

  const handleLogout = () => {
    fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
    setSubscriptions([]);
  };

  const displayToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage('');
    }, 3000);
  };

  const handleAddFeedback = (newFeedback) => {
    setFeedbackList(prev => [newFeedback, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#0B1120] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-royal-purple-600 to-royal-purple-400 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-royal-purple-500/30 animate-pulse">
            S
          </div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading STArt...</p>
        </div>
      </div>
    );
  }

  // Shared DashboardLayout props for both User and Admin/Analyst routes
  const layoutProps = {
    user,
    displayCurrency,
    setDisplayCurrency,
    feedbackList,
    onAddFeedback: handleAddFeedback,
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider user={user} setUser={setUser} handleLoginSuccess={handleLoginSuccess} handleLogout={handleLogout}>
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

          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public Route — Landing Page (unauthenticated only) */}
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
                        onGoLanding={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        onGoDashboard={() => setIsAuthModalOpen(true)}
                      />
                      <LandingPage
                        user={user}
                        feedbackList={feedbackList}
                        onAddFeedback={handleAddFeedback}
                      />
                    </>
                  </PublicRoute>
                }
              />

              {/* Authenticated Dashboard (User role) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute user={user} allowedRoles={['User']}>
                    <DashboardLayout {...layoutProps} />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <DashboardPage
                      subscriptions={subscriptions}
                      setSubscriptions={setSubscriptions}
                      displayCurrency={displayCurrency}
                      displayToast={displayToast}
                    />
                  }
                />
                <Route
                  path="analytics"
                  element={<AnalyticsView subscriptions={subscriptions} displayCurrency={displayCurrency} />}
                />
                <Route
                  path="trial-hub"
                  element={
                    <TrialHubView
                      subscriptions={subscriptions}
                      setSubscriptions={setSubscriptions}
                      displayCurrency={displayCurrency}
                      displayToast={displayToast}
                    />
                  }
                />
                <Route
                  path="settings"
                  element={
                    <SettingsView
                      user={user}
                      setUser={setUser}
                      onLogout={handleLogout}
                      displayCurrency={displayCurrency}
                      setDisplayCurrency={setDisplayCurrency}
                    />
                  }
                />
              </Route>

              {/* Authenticated Admin Layout */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute user={user} allowedRoles={['Admin']}>
                    <DashboardLayout {...layoutProps} />
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
                    <DashboardLayout {...layoutProps} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AnalystPage user={user} />} />
              </Route>

              {/* 404 — catch-all for any unmatched route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
