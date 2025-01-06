import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../Button';
import { OfferCard } from './OfferCard';
import { OfferForm } from './OfferForm';
import type { Offer } from '../../types/offer';

interface OffersListProps {
  offers: Offer[];
  onCreateOffer: (data: any) => Promise<void>;
  onDeleteOffer: (offerId: string) => Promise<void>;
  showActions?: boolean;
}

export function OffersList({ 
  offers, 
  onCreateOffer, 
  onDeleteOffer,
  showActions = false 
}: OffersListProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (data: any) => {
    await onCreateOffer(data);
    setShowForm(false);
  };

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
        {offers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onDelete={showActions ? onDeleteOffer : undefined}
            showActions={showActions}
          />
        ))}
      </div>
    </div>
  );
}