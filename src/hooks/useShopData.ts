import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ShopData {
  name: string;
  code: string;
  ownerId: string;
  createdAt: string;
}

export function useShopData(userId: string) {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShopData() {
      try {
        const shopDoc = await getDoc(doc(db, 'shops', userId));
        if (shopDoc.exists()) {
          setShopData(shopDoc.data() as ShopData);
        }
      } catch (err) {
        setError('Failed to load shop data');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchShopData();
    }
  }, [userId]);

  return { shopData, loading, error };
}