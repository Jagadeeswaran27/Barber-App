import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-[320px] animate-fade-in">
      <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-xs">{message}</span>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-green-500 rounded-full transition-colors flex-shrink-0"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}