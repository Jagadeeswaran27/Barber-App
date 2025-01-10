import { useState } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Input } from '../components/Input';
import { LoadingButton } from '../components/LoadingButton';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Mail, Phone, CheckCircle2 } from 'lucide-react';

export function Profile() {
  const { user, refreshUserData } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name,
        phone: formData.phone
      });
      await refreshUserData(); // Refresh user data after update
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={`Welcome, ${user?.name || ''}`}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Profile Settings</h2>
              <p className="text-sm text-gray-500">Manage your account details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Profile updated successfully</span>
              </div>
            )}

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={loading}
              pattern="[0-9]{10}"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{user?.email}</span>
              </div>
            </div>

            <LoadingButton type="submit" loading={loading}>
              Save Changes
            </LoadingButton>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}