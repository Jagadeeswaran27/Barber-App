import { Scissors } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <Scissors className="h-12 w-12 sm:h-16 sm:w-16" />
      <span className="text-2xl sm:text-3xl font-bold">ChopNCharm</span>
    </div>
  );
}