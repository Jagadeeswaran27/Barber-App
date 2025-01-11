import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { User, Mail, Phone, Calendar } from 'lucide-react';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  connectionDate: string;
}

export function CustomerDetails() {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomerDetails() {
      if (!customerId) return;

      try {
        const customerDoc = await getDoc(doc(db, 'users', customerId));
        if (customerDoc.exists()) {
          const data = customerDoc.data();
          setCustomer({
            id: customerDoc.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            connectionDate: data.createdAt
          });
        } else {
          setError('Customer not found');
        }
      } catch (err) {
        console.error('Error fetching customer details:', err);
        setError('Failed to load customer details');
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerDetails();
  }, [customerId]);

  if (loading) {
    return (
      <DashboardLayout title="Customer Details">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !customer) {
    return (
      <DashboardLayout title="Customer Details">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error || 'Failed to load customer details'}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Customer Details">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Customer Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{customer.name}</h2>
              <p className="text-gray-500">Customer Profile</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Connected Since</p>
                  <p className="font-medium">
                    {new Date(customer.connectionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}