import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import type { Offer } from '../types/offer';

interface NotificationPopupProps {
  offers: Offer[];
  onClose: () => void;
  shopId: string;
  shopName: string;
  shopCode: string; // Add shopCode prop
}

export function NotificationPopup({ offers, onClose, shopId, shopName, shopCode }: NotificationPopupProps) {
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const isOfferActive = (offer: Offer) => {
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    return now >= start && now <= end;
  };

  const activeOffers = offers.filter(isOfferActive);

  const handleToggleOffer = (offerId: string) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleNotify = async () => {
    if (selectedOffers.length === 0) return;
    
    setLoading(true);
    try {
      const notifyUsers = httpsCallable(functions, 'notifyUsers');
      await notifyUsers({
        shopId,
        offerIds: selectedOffers,
        shopName,
        shopCode // Include shopCode in the function call
      });
      onClose();
    } catch (error) {
      console.error('Failed to send notifications:', error);
    } finally {
      setLoading(false);
    }
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
            {activeOffers.map(offer => (
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

          {activeOffers.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No active offers available
            </p>
          )}
        </div>

        <div className="p-4 border-t">
          <Button
            onClick={handleNotify}
            disabled={selectedOffers.length === 0 || loading}
            className="w-full"
          >
            {loading ? 'Sending...' : `Notify (${selectedOffers.length} selected)`}
          </Button>
        </div>
      </div>
    </div>
  );
}