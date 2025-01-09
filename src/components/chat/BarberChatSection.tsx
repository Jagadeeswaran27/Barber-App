import { useEffect, useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { ChatList } from './ChatList';
import { useBarberChats } from '../../hooks/useBarberChats';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, MessageSquare } from 'lucide-react';

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
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    if (selectedChatId) {
      markMessagesAsRead();
      setShowMobileChat(true);
    }
  }, [selectedChatId, markMessagesAsRead]);

  const handleSendMessage = async (content: string) => {
    if (!user) return;
    await sendMessage(content, user.id, user.name);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedChatId(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)] max-h-[800px] min-h-[500px] bg-white rounded-lg border border-gray-100">
      <div 
        className={`lg:w-80 h-full ${
          showMobileChat ? 'hidden lg:block' : 'block'
        } lg:border-r border-gray-100`}
      >
        <ChatList
          chats={chats}
          onSelectChat={setSelectedChatId}
          selectedChatId={selectedChatId}
          loading={chatsLoading}
        />
      </div>
      
      <div className={`flex-1 h-full ${
        !showMobileChat ? 'hidden lg:flex' : 'flex'
      } flex-col`}>
        {selectedChatId ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b bg-white">
              <button
                onClick={handleBackToList}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 text-sm font-medium">
                    {selectedChat?.customerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {selectedChat?.customerName}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                loading={messagesLoading}
                currentUserId={user?.id}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-center">
              Select a conversation to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}