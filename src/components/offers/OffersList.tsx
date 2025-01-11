import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../Button';
import { OfferCard } from './OfferCard';
import { OfferForm } from './OfferForm';
import { OfferFilters } from './OfferFilters';
import { Toast } from '../Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useOfferRedemptions } from '../../hooks/useOfferRedemptions';
import type { Offer } from '../../types/offer';

type FilterStatus = 'all' | 'active' | 'inactive';

interface OffersListProps {
  offers: Offer[];
  onCreateOffer: (data: any) => Promise<void>;
  onToggleStatus?: (offerId: string, active: boolean) => Promise<void>;
  onRedeemOffer?: (offerId: string) => Promise<void>;
  showActions?: boolean;
}

export function OffersList({ 
  offers, 
  onCreateOffer, 
  onToggleStatus,
  onRedeemOffer,
  showActions = false 
}: OffersListProps) {
  const [showForm, setShowForm] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('all');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { user } = useAuth();
  const { isOfferRedeemed, markAsRedeemed } = useOfferRedemptions(user?.id || '');

  const isOfferActive = (offer: Offer) => {
    if (!offer.active) return false;
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    return now >= start && now <= end;
  };

  const filteredOffers = offers.filter(offer => {
    if (user?.type === 'customer') {
      return isOfferActive(offer) && !isOfferRedeemed(offer.id);
    }
    
    switch (currentFilter) {
      case 'active':
        return isOfferActive(offer);
      case 'inactive':
        return !isOfferActive(offer);
      default:
        return true;
    }
  });

  const counts = {
    active: offers.filter(isOfferActive).length,
    inactive: offers.length - offers.filter(isOfferActive).length,
    total: offers.length
  };

  const handleSubmit = async (data: any) => {
    await onCreateOffer(data);
    setShowForm(false);
    setShowSuccessToast(true);
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
            onToggleStatus={showActions ? onToggleStatus : undefined}
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

      {showSuccessToast && (
        <Toast
          message="New offer created successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </div>
  );
}