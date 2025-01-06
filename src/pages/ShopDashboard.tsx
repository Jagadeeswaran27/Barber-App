import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

export function ShopDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Welcome to your shop, {user?.name}</h1>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Shop dashboard content coming soon...</p>
        </div>
      </div>
    </div>
  );
}