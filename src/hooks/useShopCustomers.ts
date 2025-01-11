import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  connectionDate: string;
}

export function useShopCustomers(shopId: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        // Get all customer connections for this shop
        const connectionsQuery = query(
          collection(db, 'customerShops'),
          where('shopId', '==', shopId)
        );
        const connectionsSnapshot = await getDocs(connectionsQuery);
        
        // Get customer details for each connection
        const customerPromises = connectionsSnapshot.docs.map(async (doc) => {
          const connection = doc.data();
          const customerDoc = await getDocs(
            query(
              collection(db, 'users'),
              where('type', '==', 'customer')
            )
          );
          
          const customerData = customerDoc.docs.find(doc => doc.id === connection.customerId)?.data();
          
          if (customerData) {
            return {
              id: connection.customerId,
              name: customerData.name,
              email: customerData.email,
              phone: customerData.phone,
              connectionDate: connection.createdAt
            };
          }
          return null;
        });

        const customersData = (await Promise.all(customerPromises)).filter((customer): customer is Customer => customer !== null);
        setCustomers(customersData);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    }

    if (shopId) {
      fetchCustomers();
    }
  }, [shopId]);

  return { customers, loading, error };
}