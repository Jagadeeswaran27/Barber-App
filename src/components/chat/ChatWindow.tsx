import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  loading?: boolean;
  currentUserId?: string;
}

export function ChatWindow({ 
  messages, 
  onSendMessage, 
  loading,
  currentUserId 
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-amber-50/20 to-white"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isFirstInGroup = index === 0 || 
              messages[index - 1].senderId !== message.senderId;
            const isLastInGroup = index === messages.length - 1 || 
              messages[index + 1].senderId !== message.senderId;
            const isSentByCurrentUser = message.senderId === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] lg:max-w-[70%] space-y-1 ${
                  isSentByCurrentUser ? 'items-end' : 'items-start'
                }`}>
                  {isFirstInGroup && (
                    <span className={`text-xs font-medium ${
                      isSentByCurrentUser 
                        ? 'text-right text-amber-700' 
                        : 'text-left text-gray-600'
                    } block px-2`}>
                      {message.senderName}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isSentByCurrentUser
                        ? 'bg-amber-600 text-white'
                        : 'bg-white shadow-sm border border-gray-100'
                    } ${!isLastInGroup ? 'mb-1' : ''}`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  {isLastInGroup && (
                    <span className={`text-[10px] ${
                      isSentByCurrentUser ? 'text-right' : 'text-left'
                    } block text-gray-400 px-2`}>
                      {formatMessageTime(message.timestamp)}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-w-0 text-sm border-gray-200 rounded-full px-4 py-2 focus:border-amber-500 focus:ring-amber-500 bg-gray-50/50"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:hover:bg-amber-600 flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}