import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ShopSetup } from './pages/ShopSetup';
import { UserDashboard } from './pages/UserDashboard';
import ShopDashboard from './pages/ShopDashboard';
import { ShopDetails } from './pages/ShopDetails';
import { Profile } from './pages/Profile';
import { useEffect } from 'react';
import { isNative } from './utils/platform';
import { PushNotifications } from '@capacitor/push-notifications';

export default function App() {
  useEffect(() => {
    if (isNative()) {
      // Only initialize push notifications on native platforms
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
      });
    }
  }, []);

  return (
    <AuthProvider>
      {({ loading }) =>
        loading ? (
          <LoadingScreen />
        ) : (
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <Home />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <SignUp />
                  </PublicRoute>
                }
              />
              <Route
                path="/shop-setup"
                element={
                  <PublicRoute>
                    <ShopSetup />
                  </PublicRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute userType="customer">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop"
                element={
                  <ProtectedRoute userType="barber">
                    <ShopDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shop/:shopId"
                element={
                  <ProtectedRoute userType="customer">
                    <ShopDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute userType="any">
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        )
      }
    </AuthProvider>
  );
}
