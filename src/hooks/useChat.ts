import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Message } from '../types/chat';

export function useChat(shopId: string, customerId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getChatId = (shopId: string, userId: string) => `${shopId}_${userId}`;

  const initializeChat = async (shopId: string, userId: string) => {
    try {
      const chatId = getChatId(shopId, userId);
      
      // Get user details
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userName = userDoc.exists() ? userDoc.data().name : 'Unknown User';
      
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        shopId,
        customerId: userId,
        customerName: userName,
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        unreadCount: 0
      }, { merge: true });
      return chatId;
    } catch (err) {
      console.error('Error initializing chat:', err);
      setError('Failed to initialize chat');
      return null;
    }
  };

  useEffect(() => {
    if (!shopId || !customerId) return;

    const chatId = getChatId(shopId, customerId);
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId)
    );

    const unsubscribe = onSnapshot(messagesQuery, 
      async (snapshot) => {
        const messagesList = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let senderName = data.senderName;
            
            if (!senderName) {
              try {
                const userDoc = await getDoc(doc(db, 'users', data.senderId));
                if (userDoc.exists()) {
                  senderName = userDoc.data().name;
                }
              } catch (err) {
                console.warn('Could not fetch sender name:', err);
                senderName = 'Unknown User';
              }
            }
            
            return {
              id: doc.id,
              ...data,
              senderName,
              timestamp: data.timestamp?.toDate?.() || new Date(),
            } as Message;
          })
        );

        setMessages(messagesList.sort((a, b) => 
          a.timestamp.getTime() - b.timestamp.getTime()
        ));
        setLoading(false);
      },
      (err) => {
        console.error('Error loading messages:', err);
        setError('Unable to load messages');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [shopId, customerId]);

  const sendMessage = async (content: string, senderId: string, senderName: string) => {
    if (!shopId || !customerId) return;

    try {
      const chatId = getChatId(shopId, customerId);
      await addDoc(collection(db, 'messages'), {
        chatId,
        content,
        senderId,
        senderName,
        timestamp: serverTimestamp(),
        read: false
      });

      // Update chat's last message and increment unread count if message is from customer
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: content,
        lastMessageTime: serverTimestamp(),
        unreadCount: senderId === customerId ? increment(1) : 0
      });

    } catch (err) {
      console.error('Error sending message:', err);
      throw new Error('Failed to send message');
    }
  };

  const markMessagesAsRead = async () => {
    if (!shopId || !customerId) return;
    
    const chatId = getChatId(shopId, customerId);
    const chatRef = doc(db, 'chats', chatId);
    
    try {
      await updateDoc(chatRef, {
        unreadCount: 0
      });
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    initializeChat,
    markMessagesAsRead
  };
}