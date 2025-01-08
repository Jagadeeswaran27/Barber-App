import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../Button';
import { OfferCard } from './OfferCard';
import { OfferForm } from './OfferForm';
import { OfferFilters } from './OfferFilters';
import { useAuth } from '../../contexts/AuthContext';
import { useOfferRedemptions } from '../../hooks/useOfferRedemptions';
import type { Offer } from '../../types/offer';

type FilterStatus = 'all' | 'active' | 'inactive';

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
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const { user } = useAuth();
  const { isOfferRedeemed, markAsRedeemed } = useOfferRedemptions(user?.id || '');

  const isOfferActive = (offer: Offer) => {
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    return now >= start && now <= end;
  };

  const filteredOffers = useMemo(() => {
    let filtered = offers;

    // For customers, only show active offers and hide redeemed ones
    if (user?.type === 'customer') {
      filtered = filtered.filter(offer => 
        isOfferActive(offer) && !isOfferRedeemed(offer.id)
      );
    } else {
      // For barbers, apply filter
      if (currentFilter === 'active') {
        filtered = filtered.filter(isOfferActive);
      } else if (currentFilter === 'inactive') {
        filtered = filtered.filter(offer => !isOfferActive(offer));
      }
    }

    return filtered;
  }, [offers, currentFilter, user?.type, isOfferRedeemed]);

  const counts = useMemo(() => {
    const active = offers.filter(isOfferActive).length;
    return {
      active,
      inactive: offers.length - active,
      total: offers.length
    };
  }, [offers]);

  const handleSubmit = async (data: any) => {
    await onCreateOffer(data);
    setShowForm(false);
  };

  const handleRedeem = async (offerId: string) => {
    if (!onRedeemOffer) return;
    
    try {
      await onRedeemOffer(offerId);
      markAsRedeemed(offerId);
    } catch (err) {
      console.error('Failed to redeem offer:', err);
      throw err;
    }
  };

  return (
    <div className="space-y-4">
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 order-1 sm:order-2"
          >
            <Plus className="h-4 w-4" />
            New Offer
          </Button>
          
          <div className="order-2 sm:order-1">
            <OfferFilters
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              counts={counts}
            />
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <OfferForm onSubmit={handleSubmit} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredOffers.map(offer => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onDelete={showActions ? onDeleteOffer : undefined}
            onRedeem={user?.type === 'customer' ? () => handleRedeem(offer.id) : undefined}
            showActions={showActions}
          />
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No offers available
        </div>
      )}
    </div>
  );
}