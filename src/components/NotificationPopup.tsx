import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import type { Offer } from '../types/offer';

interface NotificationPopupProps {
  offers: Offer[];
  onClose: () => void;
}

export function NotificationPopup({ offers, onClose }: NotificationPopupProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);

  const handleToggleOffer = (offerId: string) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleNotify = () => {
    const selected = offers.filter(offer => selectedOffers.includes(offer.id));
    console.log('Selected offers for notification:', selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Notify Customers</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {offers.map(offer => (
              <label 
                key={offer.id}
                className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedOffers.includes(offer.id)}
                  onChange={() => handleToggleOffer(offer.id)}
                  className="mt-1 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <h4 className="font-medium">{offer.title}</h4>
                  <p className="text-sm text-gray-600">{offer.description}</p>
                  <span className="text-amber-600 font-medium">
                    {offer.discount}% OFF
                  </span>
                </div>
              </label>
            ))}
          </div>

          {offers.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No active offers available
            </p>
          )}
        </div>

        <div className="p-4 border-t">
          <Button
            onClick={handleNotify}
            disabled={selectedOffers.length === 0}
            className="w-full"
          >
            Notify ({selectedOffers.length} selected)
          </Button>
        </div>
      </div>
    </div>
  );
}