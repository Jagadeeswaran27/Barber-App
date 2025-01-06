import { useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useOfferRedemption(offerId: string, customerId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redeemOffer = async (shopId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Check if already redeemed
      const q = query(
        collection(db, 'offerRedemptions'),
        where('offerId', '==', offerId),
        where('customerId', '==', customerId)
      );
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error('You have already redeemed this offer');
      }

      // Create redemption record
      await addDoc(collection(db, 'offerRedemptions'), {
        offerId,
        customerId,
        shopId,
        redeemedAt: new Date().toISOString()
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem offer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { redeemOffer, loading, error };
}