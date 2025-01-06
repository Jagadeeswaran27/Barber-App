import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <div className="bg-white shadow safe-top fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between">
              <Link to="/">
                <Logo className="scale-90 sm:scale-100" />
              </Link>
              <Button 
                variant="secondary" 
                onClick={handleLogout}
                className="sm:hidden text-sm px-3"
              >
                Logout
              </Button>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between">
              <h1 className="text-base sm:text-xl font-semibold truncate">{title}</h1>
              <Button 
                variant="secondary" 
                onClick={handleLogout}
                className="hidden sm:block"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8 mt-[120px] sm:mt-[88px]">
        {children}
      </div>
    </div>
  );
}