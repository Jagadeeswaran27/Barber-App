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
        const now = new Date();
        const offersQuery = query(
          collection(db, 'offers'),
          where('shopId', '==', shopId)
        );
        const offersSnapshot = await getDocs(offersQuery);
        const activeOffersCount = offersSnapshot.docs.filter(doc => {
          const data = doc.data();
          const endDate = new Date(data.endDate);
          const startDate = new Date(data.startDate);
          return now >= startDate && now <= endDate;
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