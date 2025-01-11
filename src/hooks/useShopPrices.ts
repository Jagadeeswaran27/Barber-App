import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { PriceItem } from '../types/price';

export function useShopPrices(shopId: string) {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    if (!shopId) return;
    
    try {
      const q = query(
        collection(db, 'prices'),
        where('shopId', '==', shopId)
      );
      const snapshot = await getDocs(q);
      setPrices(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as PriceItem)));
    } catch (err) {
      setError('Failed to load prices');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const refreshPrices = useCallback(async () => {
    setLoading(true);
    await fetchPrices();
  }, [fetchPrices]);

  const createPrice = async (priceData: Omit<PriceItem, 'id' | 'shopId' | 'createdAt'>) => {
    try {
      const newPrice = {
        ...priceData,
        shopId,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'prices'), newPrice);
      const price = { id: docRef.id, ...newPrice };
      setPrices(prev => [...prev, price]);
      return price;
    } catch (err) {
      console.error('Error creating price:', err);
      throw new Error('Failed to create price');
    }
  };

  const deletePrice = async (priceId: string) => {
    try {
      await deleteDoc(doc(db, 'prices', priceId));
      setPrices(prev => prev.filter(price => price.id !== priceId));
    } catch (err) {
      console.error('Error deleting price:', err);
      throw new Error('Failed to delete price');
    }
  };

  return { 
    prices, 
    loading, 
    error, 
    createPrice,
    deletePrice,
    refreshPrices
  };
}