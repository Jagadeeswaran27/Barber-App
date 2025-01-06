export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  shopId: string;
  customerId: string;
  customerName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}