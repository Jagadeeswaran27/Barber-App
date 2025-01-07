import { MessageSquare, Store } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'details' | 'chat';
  onTabChange: (tab: 'details' | 'chat') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-bottom lg:hidden">
      <div className="flex items-center">
        <button
          onClick={() => onTabChange('details')}
          className={`flex-1 flex flex-col items-center pt-3 ${
            activeTab === 'details' 
              ? 'text-amber-600' 
              : 'text-gray-600'
          }`}
        >
          <Store className="h-5 w-5" />
          <span className="text-xs">Details</span>
        </button>
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 flex flex-col items-center pt-3 ${
            activeTab === 'chat' 
              ? 'text-amber-600' 
              : 'text-gray-600'
          }`}
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-xs">Messages</span>
        </button>
      </div>
    </div>
  );
}