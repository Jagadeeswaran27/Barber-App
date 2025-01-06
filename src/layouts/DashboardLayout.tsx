import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Logo />
              </Link>
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}