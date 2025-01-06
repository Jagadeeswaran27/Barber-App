import { useAuth } from '../contexts/AuthContext';
import { useCustomerShops } from '../hooks/useCustomerShops';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ShopConnection } from '../components/ShopConnection';
import { Scissors } from 'lucide-react';

export function UserDashboard() {
  const { user } = useAuth();
  const { 
    shops, 
    loading, 
    connectToShop, 
    disconnectFromShop 
  } = useCustomerShops(user?.id || '');

  if (!user) return null;

  return (
    <DashboardLayout title={`Welcome, ${user.name}`}>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Scissors className="h-6 w-6 animate-spin text-amber-600" />
          </div>
        ) : (
          <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-6">Manage Your Shops</h2>
            <ShopConnection
              shops={shops}
              onConnect={connectToShop}
              onDisconnect={disconnectFromShop}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}