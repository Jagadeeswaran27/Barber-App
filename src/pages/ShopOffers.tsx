import { useAuth } from '../contexts/AuthContext';
import { useShopOffers } from '../hooks/useShopOffers';
import { OffersList } from '../components/offers/OffersList';
import { Button } from '../components/Button';
import { Bell, Scissors } from 'lucide-react';
import { NotificationPopup } from '../components/NotificationPopup';
import { useState } from 'react';
import { useShopData } from '../hooks/useShopData';

export function ShopOffers() {
  const { user } = useAuth();
  const { shopData } = useShopData(user?.id || '');
  const { offers, loading: offersLoading, createOffer, deleteOffer } = useShopOffers(user?.id || '');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowNotificationPopup(true)}
          variant="secondary"
          className="flex items-center gap-2 text-sm"
        >
          <Bell className="h-4 w-4" />
          Notify Customers
        </Button>
      </div>

      {offersLoading ? (
        <div className="flex items-center justify-center p-4">
          <Scissors className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : (
        <OffersList
          offers={offers}
          onCreateOffer={createOffer}
          onDeleteOffer={deleteOffer}
          showActions
        />
      )}

      {showNotificationPopup && (
        <NotificationPopup
          offers={offers}
          onClose={() => setShowNotificationPopup(false)}
          shopId={user.id}
          shopName={shopData?.name || 'Unnamed Shop'}
          shopCode={shopData?.code || ''}
        />
      )}
    </div>
  );
}