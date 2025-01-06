import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Scissors className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
      <span className="text-xl sm:text-2xl font-bold text-gray-900">BarberBook</span>
    </Link>
  );
}