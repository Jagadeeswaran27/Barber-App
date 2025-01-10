import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import { PriceForm } from './PriceForm';
import { Toast } from '../Toast';
import type { PriceItem } from '../../types/price';

interface PriceListProps {
  prices: PriceItem[];
  onCreatePrice: (data: any) => Promise<void>;
  onDeletePrice: (priceId: string) => Promise<void>;
}

export function PriceList({ prices, onCreatePrice, onDeletePrice }: PriceListProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSubmit = async (data: any) => {
    await onCreatePrice(data);
    setShowForm(false);
    setShowSuccessToast(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <PriceForm onSubmit={handleSubmit} />
        </div>
      )}

      <div className="grid gap-4">
        {prices.map(price => (
          <div
            key={price.id}
            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900">{price.name}</h3>
                <div className="flex items-baseline gap-1 flex-shrink-0">
                  <span className="text-lg font-bold text-amber-600">₹{price.price}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onDeletePrice(price.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}

        {prices.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No services added yet
          </div>
        )}
      </div>

      {showSuccessToast && (
        <Toast
          message="Service added successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
}