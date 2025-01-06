import { useState } from 'react';
import { Search, Circle } from 'lucide-react';
import type { Chat } from '../../types/chat';

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  selectedChatId?: string;
  loading?: boolean;
}

export function ChatList({ chats, onSelectChat, selectedChatId, loading }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-amber-500 bg-gray-50/50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Search className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full px-3 py-3 text-left transition-colors ${
                  selectedChatId === chat.id 
                    ? 'bg-amber-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-amber-800 font-medium">
                      {chat.customerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {chat.customerName}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {chat.unreadCount > 0 && (
                          <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            {chat.unreadCount}
                          </span>
                        )}
                        {chat.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        )}
                      </div>
                    </div>
                    {chat.lastMessage && (
                      <p className={`text-sm truncate mt-0.5 ${
                        chat.unreadCount > 0 
                          ? 'text-gray-900 font-medium' 
                          : 'text-gray-500'
                      }`}>
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}