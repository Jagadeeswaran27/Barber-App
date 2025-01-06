import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../Button';
import { OfferCard } from './OfferCard';
import { OfferForm } from './OfferForm';
import { useAuth } from '../../contexts/AuthContext';
import { useOfferRedemptions } from '../../hooks/useOfferRedemptions';
import type { Offer } from '../../types/offer';

interface OffersListProps {
  offers: Offer[];
  onCreateOffer: (data: any) => Promise<void>;
  onDeleteOffer: (offerId: string) => Promise<void>;
  onRedeemOffer?: (offerId: string) => Promise<void>;
  showActions?: boolean;
}

export function OffersList({ 
  offers, 
  onCreateOffer, 
  onDeleteOffer,
  onRedeemOffer,
  showActions = false 
}: OffersListProps) {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { isOfferRedeemed, markAsRedeemed } = useOfferRedemptions(user?.id || '');

  const handleSubmit = async (data: any) => {
    await onCreateOffer(data);
    setShowForm(false);
  };

  const handleRedeem = async (offerId: string) => {
    if (onRedeemOffer) {
      await onRedeemOffer(offerId);
      markAsRedeemed(offerId);
    }
  };

  // Filter out redeemed offers for customers
  const availableOffers = offers.filter(offer => 
    user?.type === 'barber' || !isOfferRedeemed(offer.id)
  );

  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex justify-end">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Offer
          </Button>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <OfferForm onSubmit={handleSubmit} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {availableOffers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onDelete={showActions ? onDeleteOffer : undefined}
            onRedeem={user?.type === 'customer' ? () => handleRedeem(offer.id) : undefined}
            showActions={showActions}
          />
        ))}
      </div>

      {user?.type === 'customer' && availableOffers.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No available offers at the moment
        </div>
      )}
    </div>
  );
}