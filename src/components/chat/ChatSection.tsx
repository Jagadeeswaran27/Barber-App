import { useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';

interface ChatSectionProps {
  shopId: string;
}

export function ChatSection({ shopId }: ChatSectionProps) {
  const { user } = useAuth();
  const { messages, loading, sendMessage, initializeChat } = useChat(shopId, user?.id);

  useEffect(() => {
    if (user && shopId) {
      initializeChat(shopId, user.id);
    }
  }, [shopId, user]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    await sendMessage(content, user.id, user.name);
  };

  return (
    <div className="-m-6"> {/* Negative margin to counteract parent padding */}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={loading}
        currentUserId={user?.id}
      />
    </div>
  );
}