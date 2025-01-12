import { Scissors } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'home';
}

export function Logo({ className = '', variant = 'default' }: LogoProps) {
  if (variant === 'home') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <Scissors className="h-12 w-12 sm:h-16 sm:w-16" />
        <span className="text-2xl sm:text-3xl font-bold">ChopNCharm</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Scissors className="h-6 w-6 text-amber-600" />
      <span className="text-xl font-bold">ChopNCharm</span>
    </div>
  );
}