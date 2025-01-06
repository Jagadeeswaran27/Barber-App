import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CustomerShop {
  id: string;
  customerId: string;
  shopId: string;
  shopCode: string;
  createdAt: string;
}

export function useCustomerShops(customerId: string) {
  const [shops, setShops] = useState<CustomerShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;
    
    const fetchShops = async () => {
      try {
        const q = query(
          collection(db, 'customerShops'),
          where('customerId', '==', customerId)
        );
        const snapshot = await getDocs(q);
        setShops(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomerShop)));
      } catch (err) {
        setError('Failed to load shops');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [customerId]);

  const connectToShop = async (shopCode: string) => {
    try {
      // Check if shop exists
      const shopQuery = query(
        collection(db, 'shops'),
        where('code', '==', shopCode)
      );
      const shopSnapshot = await getDocs(shopQuery);
      
      if (shopSnapshot.empty) {
        throw new Error('Invalid shop code');
      }

      const shopDoc = shopSnapshot.docs[0];
      
      // Check if already connected
      const existingConnection = shops.find(shop => shop.shopCode === shopCode);
      if (existingConnection) {
        throw new Error('Already connected to this shop');
      }

      // Create connection
      await addDoc(collection(db, 'customerShops'), {
        customerId,
        shopId: shopDoc.id,
        shopCode,
        createdAt: new Date().toISOString()
      });

      // Refresh shops list
      const q = query(
        collection(db, 'customerShops'),
        where('customerId', '==', customerId)
      );
      const snapshot = await getDocs(q);
      setShops(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CustomerShop)));

      return true;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error('Failed to connect to shop');
    }
  };

  const disconnectFromShop = async (connectionId: string) => {
    try {
      await deleteDoc(doc(db, 'customerShops', connectionId));
      setShops(shops.filter(shop => shop.id !== connectionId));
      return true;
    } catch (err) {
      throw new Error('Failed to disconnect from shop');
    }
  };

  return { shops, loading, error, connectToShop, disconnectFromShop };
}