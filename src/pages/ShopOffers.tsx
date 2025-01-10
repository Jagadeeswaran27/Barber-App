import { useAuth } from '../contexts/AuthContext';
import { useShopOffers } from '../hooks/useShopOffers';
import { OffersList } from '../components/offers/OffersList';
import { Scissors } from 'lucide-react';
import { useShopData } from '../hooks/useShopData';
import { functions } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';

export function ShopOffers() {
  const { user } = useAuth();
  const { shopData } = useShopData(user?.id || '');
  const { 
    offers, 
    loading: offersLoading, 
    createOffer,
    toggleOfferStatus 
  } = useShopOffers(user?.id || '');

  if (!user) return null;

  const handleCreateOffer = async (offerData: any) => {
    let createdOffer;
    try {
      // First create the offer
      createdOffer = await createOffer(offerData);
      
      if (createdOffer) {
        // Only notify users if offer was created successfully
        const notifyUsers = httpsCallable(functions, 'notifyUsers');
        await notifyUsers({
          shopId: user.id,
          offerIds: [createdOffer.id],
          shopName: shopData?.name || 'Shop',
          shopCode: shopData?.code || ''
        });
      }

      return createdOffer;
    } catch (err) {
      console.error('Error in offer creation process:', err);
      throw err;
    }
  };

  return (
    <div className="space-y-4">
      {offersLoading ? (
        <div className="flex items-center justify-center p-4">
          <Scissors className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : (
        <OffersList
          offers={offers}
          onCreateOffer={handleCreateOffer}
          onToggleStatus={toggleOfferStatus}
          showActions
        />
      )}
    </div>
  );
}