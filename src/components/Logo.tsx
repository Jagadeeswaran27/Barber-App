import { Scissors } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Scissors className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
      <span className="text-xl sm:text-2xl font-bold text-gray-900">BarberBook</span>
    </div>
  );
}