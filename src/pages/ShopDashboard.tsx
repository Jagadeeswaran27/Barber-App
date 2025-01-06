import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';

export function ShopDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title={`Welcome to your shop, ${user?.name}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Shop dashboard content coming soon...</p>
      </div>
    </DashboardLayout>
  );
}