import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { withRetry } from '../utils/firebase';
import { generateQRCode } from '../utils/qrCode';
import type { Offer } from '../types/offer';
import { useState, useEffect, useCallback } from 'react';

export function useShopOffers(shopId: string) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    if (!shopId) return;
    
    try {
      const q = query(
        collection(db, 'offers'),
        where('shopId', '==', shopId)
      );
      const snapshot = await withRetry(() => getDocs(q));
      setOffers(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Offer)));
    } catch (err) {
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const refreshOffers = useCallback(async () => {
    setLoading(true);
    await fetchOffers();
  }, [fetchOffers]);

  const isWithinDateRange = (startDate: string, endDate: string) => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return now >= start && now <= end;
  };

  const createOffer = async (offerData: Omit<Offer, 'id' | 'shopId' | 'createdAt' | 'qrCode' | 'code' | 'active'>) => {
    try {
      const offerCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const qrCode = await generateQRCode(offerCode);

      // Set active status based on date range
      const active = isWithinDateRange(offerData.startDate, offerData.endDate);

      const newOffer = {
        ...offerData,
        shopId,
        createdAt: new Date().toISOString(),
        qrCode,
        code: offerCode,
        active
      };
      
      const docRef = await withRetry(() => addDoc(collection(db, 'offers'), newOffer));
      const offer = { id: docRef.id, ...newOffer };
      setOffers(prev => [...prev, offer]);
      return offer;
    } catch (err) {
      console.error('Error creating offer:', err);
      throw new Error('Failed to create offer');
    }
  };

  const toggleOfferStatus = async (offerId: string, active: boolean) => {
    try {
      await updateDoc(doc(db, 'offers', offerId), { active });
      setOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, active } : offer
      ));
    } catch (err) {
      console.error('Error toggling offer status:', err);
      throw new Error('Failed to update offer status');
    }
  };

  return { 
    offers, 
    loading, 
    error, 
    createOffer,
    toggleOfferStatus,
    refreshOffers
  };
}