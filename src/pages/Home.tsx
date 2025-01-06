import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { Button } from '../components/Button';
import { FeatureCard } from '../components/FeatureCard';
import { Logo } from '../components/Logo';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Logo />
        <div className="flex gap-2 sm:gap-4">
          <Link to="/login">
            <Button variant="secondary" className="text-sm sm:text-base px-3 sm:px-6">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="text-sm sm:text-base px-3 sm:px-6">Sign Up</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Book Your Next Haircut with Ease
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12">
            Connect with top barbers in your area. Simple booking, exceptional results.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3">
                I'm a User
              </Button>
            </Link>
            <Link to="/signup" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-2.5 sm:py-3">
                I'm a Barber
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            title="Easy Booking"
            description="Book appointments with your favorite barber in just a few clicks."
          />
          <FeatureCard
            title="Manage Your Shop"
            description="Barbers can easily manage their schedule and client appointments."
          />
          <FeatureCard
            title="Real-time Updates"
            description="Get notifications and reminders for your upcoming appointments."
          />
        </div>
      </main>
    </div>
  );
}