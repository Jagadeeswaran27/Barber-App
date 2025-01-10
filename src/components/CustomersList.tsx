import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, X, ArrowRight } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  connectionDate: string;
}

interface CustomersListProps {
  customers: Customer[];
  onClose: () => void;
}

export function CustomersList({ customers, onClose }: CustomersListProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Connected Customers</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {customers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No customers connected yet
            </p>
          ) : (
            <div className="space-y-4">
              {customers.map(customer => (
                <Link
                  key={customer.id}
                  to={`/customer/${customer.id}`}
                  className="block p-4 border rounded-lg space-y-2 hover:border-amber-500 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-xs text-gray-500">
                          Connected since {new Date(customer.connectionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-amber-600" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}