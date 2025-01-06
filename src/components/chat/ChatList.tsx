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
    <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-100">
      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-200 focus:border-amber-500 focus:ring-amber-500 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Chats List */}
      <div className="h-[552px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500 p-4 text-center space-y-2">
            <Search className="h-8 w-8 text-gray-400" />
            <p>{searchTerm ? 'No chats found' : 'No conversations yet'}</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                selectedChatId === chat.id ? 'bg-amber-50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-amber-800 font-medium">
                    {chat.customerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">
                      {chat.customerName}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {chat.unreadCount > 0 && (
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                      )}
                      {chat.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      )}
                    </div>
                  </div>
                  {chat.lastMessage && (
                    <div className="flex items-center gap-1.5">
                      {chat.unreadCount > 0 && (
                        <Circle className="h-1.5 w-1.5 fill-amber-500 text-amber-500 flex-shrink-0" />
                      )}
                      <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}