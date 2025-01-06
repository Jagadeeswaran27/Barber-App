import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';

export function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Logo />
              </Link>
              <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
            </div>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">User dashboard content coming soon...</p>
        </div>
      </div>
    </div>
  );
}