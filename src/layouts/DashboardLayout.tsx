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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between">
              <Link to="/">
                <Logo className="scale-90 sm:scale-100" />
              </Link>
              <Button 
                variant="secondary" 
                onClick={logout}
                className="sm:hidden text-sm px-3"
              >
                Logout
              </Button>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between">
              <h1 className="text-base sm:text-xl font-semibold truncate">{title}</h1>
              <Button 
                variant="secondary" 
                onClick={logout}
                className="hidden sm:block"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}