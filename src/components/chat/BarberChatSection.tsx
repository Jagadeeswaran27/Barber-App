import { useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import { ChatList } from './ChatList';
import { useBarberChats } from '../../hooks/useBarberChats';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

interface BarberChatSectionProps {
  shopId: string;
}

export function BarberChatSection({ shopId }: BarberChatSectionProps) {
  const { user } = useAuth();
  const { chats, loading: chatsLoading, selectedChatId, setSelectedChatId } = useBarberChats(shopId);
  const selectedChat = chats.find(chat => chat.id === selectedChatId);
  const { messages, loading: messagesLoading, sendMessage, markMessagesAsRead } = useChat(
    shopId,
    selectedChat?.customerId
  );

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChatId) {
      markMessagesAsRead();
    }
  }, [selectedChatId, markMessagesAsRead]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    await sendMessage(content, user.id, user.name);
  };

  return (
    <div className="flex gap-6">
      <ChatList
        chats={chats}
        onSelectChat={setSelectedChatId}
        selectedChatId={selectedChatId}
        loading={chatsLoading}
      />
      
      <div className="flex-1">
        {selectedChatId ? (
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={messagesLoading}
            currentUserId={user?.id}
          />
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}