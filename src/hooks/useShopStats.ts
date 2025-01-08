import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ShopStats {
  customerCount: number;
  activeOffersCount: number;
}

export function useShopStats(shopId: string) {
  const [stats, setStats] = useState<ShopStats>({
    customerCount: 0,
    activeOffersCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get customer connections count
        const customerShopsQuery = query(
          collection(db, 'customerShops'),
          where('shopId', '==', shopId)
        );
        const customerSnapshot = await getDocs(customerShopsQuery);
        const customerCount = customerSnapshot.size;

        // Get active offers count
        const now = new Date().toISOString();
        const offersQuery = query(
          collection(db, 'offers'),
          where('shopId', '==', shopId)
        );
        const offersSnapshot = await getDocs(offersQuery);
        const activeOffersCount = offersSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.endDate > now;
        }).length;

        setStats({
          customerCount,
          activeOffersCount
        });
      } catch (error) {
        console.error('Error fetching shop stats:', error);
      } finally {
        setLoading(false);
      }
    }

    if (shopId) {
      fetchStats();
    }
  }, [shopId]);

  return { stats, loading };
}