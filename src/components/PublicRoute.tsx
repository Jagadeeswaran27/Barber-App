import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.type === 'customer' ? '/dashboard' : '/shop'} />;
  }

  return <>{children}</>;
}