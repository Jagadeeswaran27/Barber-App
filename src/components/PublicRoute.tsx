import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // Don't redirect if we're already on the login page and email isn't verified
  if (location.pathname === '/login' && !auth.currentUser?.emailVerified) {
    return <>{children}</>;
  }

  // Redirect authenticated users
  if (user && auth.currentUser?.emailVerified) {
    return <Navigate to={user.type === 'customer' ? '/dashboard' : '/shop'} />;
  }

  return <>{children}</>;
}