import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ShopDetails {
  id: string;
  name: string;
  code: string;
  ownerId: string;
}

export function useShopDetails(shopId: string) {
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShopDetails = useCallback(async () => {
    if (!shopId) return;

    try {
      const shopDoc = await getDoc(doc(db, 'shops', shopId));
      if (shopDoc.exists()) {
        setShopDetails({
          id: shopDoc.id,
          ...shopDoc.data() as Omit<ShopDetails, 'id'>
        });
      }
    } catch (err) {
      setError('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    fetchShopDetails();
  }, [fetchShopDetails]);

  const refreshShopDetails = useCallback(async () => {
    setLoading(true);
    await fetchShopDetails();
  }, [fetchShopDetails]);

  return { shopDetails, loading, error, refreshShopDetails };
}