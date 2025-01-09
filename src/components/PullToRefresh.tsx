import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const refreshing = useRef(false);
  const indicator = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop <= 0) {
        startY.current = e.touches[0].pageY;
        refreshing.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (container.scrollTop > 0 || refreshing.current) return;

      currentY.current = e.touches[0].pageY;
      const diff = currentY.current - startY.current;

      if (diff > 0 && indicator.current) {
        e.preventDefault();
        const pullDistance = Math.min(diff * 0.5, 100);
        indicator.current.style.transform = `translateY(${pullDistance}px)`;
        indicator.current.style.opacity = (pullDistance / 100).toString();
      }
    };

    const handleTouchEnd = async () => {
      if (refreshing.current || !indicator.current) return;

      const diff = currentY.current - startY.current;
      if (diff > 60) { // Threshold for refresh
        refreshing.current = true;
        indicator.current.style.transform = 'translateY(60px)';
        
        try {
          await onRefresh();
        } finally {
          refreshing.current = false;
          indicator.current.style.transform = 'translateY(0)';
          indicator.current.style.opacity = '0';
        }
      } else {
        indicator.current.style.transform = 'translateY(0)';
        indicator.current.style.opacity = '0';
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh]);

  return (
    <div 
      ref={containerRef} 
      className="h-full overflow-y-auto relative"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div 
        ref={indicator}
        className="absolute top-0 left-0 right-0 flex items-center justify-center h-16 -translate-y-full transition-transform pointer-events-none"
        style={{ opacity: 0 }}
      >
        <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
      </div>
      {children}
    </div>
  );
}