import { Scissors } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center">
      <div className="animate-spin mb-4">
        <Scissors className="h-12 w-12 text-amber-600" />
      </div>
      <p className="text-lg text-gray-600">Loading your barber experience...</p>
    </div>
  );
}