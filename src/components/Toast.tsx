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
    <div className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-[9999] animate-fade-in">
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md mx-auto">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <span className="flex-1 text-sm sm:text-base">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 p-1 hover:bg-green-500 rounded-full transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}