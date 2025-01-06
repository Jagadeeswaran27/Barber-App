import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { FeatureCard } from '../components/FeatureCard';
import { Logo } from '../components/Logo';
import { Scissors, Calendar, Tag, Clock } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex gap-2 sm:gap-4">
          <Link to="/login">
            <Button variant="secondary" className="text-sm sm:text-base px-3 sm:px-6">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="text-sm sm:text-base px-3 sm:px-6">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Book Your Next Haircut with Ease
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Connect with your favorite barbers, discover special offers, and manage your appointments all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button className="w-full sm:w-auto text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/signup?type=barber">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-3">
                I'm a Barber
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Calendar}
            title="Easy Booking"
            description="Book appointments with your favorite barbers in just a few clicks"
          />
          <FeatureCard
            icon={Tag}
            title="Special Offers"
            description="Get access to exclusive discounts and promotional offers"
          />
          <FeatureCard
            icon={Clock}
            title="Real-time Availability"
            description="See barber schedules and book available time slots instantly"
          />
          <FeatureCard
            icon={Scissors}
            title="Barber Management"
            description="Barbers can manage their schedule, clients, and offers efficiently"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-amber-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Barbershop?
          </h2>
          <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
            Join BarberBook today and streamline your booking process, attract more clients, and grow your business.
          </p>
          <Link to="/signup?type=barber">
            <Button variant="secondary" className="text-lg px-8 py-3">
              Join as a Barber
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}