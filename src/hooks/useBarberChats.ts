import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Chat } from '../types/chat';

export function useBarberChats(shopId: string) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;

    const chatsQuery = query(
      collection(db, 'chats'),
      where('shopId', '==', shopId)
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        try {
          const chatsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              shopId: data.shopId,
              customerId: data.customerId,
              customerName: data.customerName || 'Unknown Customer',
              lastMessage: data.lastMessage || '',
              lastMessageTime: data.lastMessageTime?.toDate?.().toISOString() || new Date().toISOString(),
              unreadCount: data.unreadCount || 0
            } as Chat;
          });

          setChats(chatsData.sort((a, b) => {
            const timeA = new Date(a.lastMessageTime).getTime();
            const timeB = new Date(b.lastMessageTime).getTime();
            return timeB - timeA;
          }));
          setLoading(false);
        } catch (err) {
          console.error('Error fetching chats:', err);
          setError('Failed to load chats');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error in chat subscription:', err);
        setError('Failed to load chats');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [shopId]);

  return {
    chats,
    loading,
    error,
    selectedChatId,
    setSelectedChatId
  };
}