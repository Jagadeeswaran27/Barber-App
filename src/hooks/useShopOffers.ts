import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { withRetry } from '../utils/firebase';
import { generateQRCode } from '../utils/qrCode';
import type { Offer } from '../types/offer';
import { useState, useEffect } from 'react';

export function useShopOffers(shopId: string) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;
    
    const fetchOffers = async () => {
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
    };

    fetchOffers();
  }, [shopId]);

  const createOffer = async (offerData: Omit<Offer, 'id' | 'shopId' | 'createdAt' | 'qrCode' | 'code'>) => {
    try {
      const offerCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const qrCode = await generateQRCode(offerCode);

      const newOffer = {
        ...offerData,
        shopId,
        createdAt: new Date().toISOString(),
        qrCode,
        code: offerCode
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

  const deleteOffer = async (offerId: string) => {
    try {
      await withRetry(() => deleteDoc(doc(db, 'offers', offerId)));
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    } catch (err) {
      console.error('Error deleting offer:', err);
      throw new Error('Failed to delete offer');
    }
  };

  const redeemOffer = async (offerId: string) => {
    try {
      // After successful redemption, remove the offer from local state
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
      return true;
    } catch (err) {
      console.error('Error redeeming offer:', err);
      throw new Error('Failed to redeem offer');
    }
  };

  return { 
    offers, 
    loading, 
    error, 
    createOffer,
    deleteOffer,
    redeemOffer
  };
}