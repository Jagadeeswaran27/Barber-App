import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useOfferRedemptions(customerId: string) {
  const [redeemedOffers, setRedeemedOffers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRedemptions = async () => {
      try {
        const q = query(
          collection(db, 'offerRedemptions'),
          where('customerId', '==', customerId)
        );
        const snapshot = await getDocs(q);
        const redemptions = new Set(snapshot.docs.map(doc => doc.data().offerId));
        setRedeemedOffers(redemptions);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchRedemptions();
    }
  }, [customerId]);

  const isOfferRedeemed = (offerId: string) => redeemedOffers.has(offerId);

  const markAsRedeemed = (offerId: string) => {
    setRedeemedOffers(prev => new Set([...prev, offerId]));
  };

  return {
    isOfferRedeemed,
    markAsRedeemed,
    loading
  };
}