import { DashboardLayout } from '../layouts/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { useShopCustomers } from '../hooks/useShopCustomers';
import { User, Mail, Phone, Search, Scissors } from 'lucide-react';
import { useState } from 'react';

export function ConnectedCustomers() {
  const { user } = useAuth();
  const { customers, loading } = useShopCustomers(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout title="Connected Customers">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-amber-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Customers List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Scissors className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No customers found' : 'No customers connected yet'}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className="p-4 border rounded-lg hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-lg truncate">{customer.name}</h3>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-2 text-gray-600 min-w-0">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate block"> {customer.email.length > 20
      ? `${customer.email.slice(0, 20)}...`
      : customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Connected since {new Date(customer.connectionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}