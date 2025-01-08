import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isNative } from '../utils/platform';
import { SideDrawer } from '../components/SideDrawer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

export function DashboardLayout({ children, title, showBackButton }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const isNativeApp = isNative();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className={`bg-white shadow-sm safe-top fixed top-0 left-0 right-0 z-10 ${
        isNativeApp ? 'pt-6' : ''
      }`}>
        <div className="px-4 py-2 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <Link to="/" className="flex-shrink-0">
                <Logo className="scale-90" />
              </Link>
              {/* <div className="flex items-baseline gap-1.5">
                <span className="text-sm text-gray-500">Hello,</span>
                <span className="font-medium">{title.split(',')[1]?.trim()}</span>
              </div> */}
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 mt-[68px]">
        {children}
      </div>

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}