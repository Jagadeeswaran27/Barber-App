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
            <div className="space-y-3">
              {customers.map(customer => (
                <Link
                  key={customer.id}
                  to={`/customer/${customer.id}`}
                  className="block bg-white border border-gray-200 rounded-lg p-3 hover:border-amber-500 hover:shadow-sm transition-all"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-amber-800 font-medium">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {customer.name}
                          </h4>
                          <div className="mt-0.5 space-y-0.5">
                            <div className="flex items-center gap-1 min-w-0">
                              <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs text-gray-600 truncate block overflow-hidden">
                                  {customer.email}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-600">
                                {customer.phone}
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">
                            Connected since {new Date(customer.connectionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                      </div>
                    </div>
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