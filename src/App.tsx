import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { UserDashboard } from './pages/UserDashboard';
import { ShopDashboard } from './pages/ShopDashboard';

export default function App() {
  return (
    <AuthProvider>
      {({ loading }) => (
        loading ? <LoadingScreen /> : (
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
            </Routes>
          </Router>
        )
      )}
    </AuthProvider>
  );
}