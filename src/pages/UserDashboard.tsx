import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';

export function UserDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title={`Welcome, ${user?.name}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">User dashboard content coming soon...</p>
      </div>
    </DashboardLayout>
  );
}