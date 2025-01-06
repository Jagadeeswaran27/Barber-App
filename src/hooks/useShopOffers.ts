import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Offer } from '../types/offer';

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
        const snapshot = await getDocs(q);
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

  const createOffer = async (offerData: Omit<Offer, 'id' | 'shopId' | 'createdAt'>) => {
    try {
      const newOffer = {
        ...offerData,
        shopId,
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, 'offers'), newOffer);
      const offer = { id: docRef.id, ...newOffer };
      setOffers(prev => [...prev, offer]);
      return offer;
    } catch (err) {
      throw new Error('Failed to create offer');
    }
  };

  const updateOffer = async (offerId: string, updates: Partial<Offer>) => {
    try {
      await updateDoc(doc(db, 'offers', offerId), updates);
      setOffers(prev => prev.map(offer => 
        offer.id === offerId ? { ...offer, ...updates } : offer
      ));
    } catch (err) {
      throw new Error('Failed to update offer');
    }
  };

  const deleteOffer = async (offerId: string) => {
    try {
      await deleteDoc(doc(db, 'offers', offerId));
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    } catch (err) {
      throw new Error('Failed to delete offer');
    }
  };

  return { 
    offers, 
    loading, 
    error, 
    createOffer, 
    updateOffer, 
    deleteOffer 
  };
}