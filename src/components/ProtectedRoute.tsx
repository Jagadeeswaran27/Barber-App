import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType: 'customer' | 'barber' | 'any';
}

export function ProtectedRoute({ children, userType }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userType !== 'any' && user.type !== userType) {
    return <Navigate to={user.type === 'customer' ? '/dashboard' : '/shop'} />;
  }

  return <>{children}</>;
}