import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { FeatureCard } from '../components/FeatureCard';
import { Logo } from '../components/Logo';
import { Scissors, Calendar, Tag, Clock } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Mobile-optimized Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-10">
        <div className="px-4 py-3 flex items-center justify-between safe-top">
          <Logo className="scale-90" />
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="secondary" className="text-sm px-3 py-1.5">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="text-sm px-3 py-1.5">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile-optimized Hero */}
      <div className="px-4 pt-24 pb-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Book Your Next Haircut with Ease
          </h1>
          <p className="text-gray-600 mb-6 mx-auto max-w-sm">
            Connect with your favorite barbers, discover special offers, and manage your appointments all in one place.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/signup">
              <Button className="w-full py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/signup?type=barber">
              <Button variant="secondary" className="w-full py-3">
                I'm a Barber
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile-optimized Features */}
      <div className="px-4 py-8 bg-white">
        <h2 className="text-xl font-bold text-center mb-6">
          Everything You Need
        </h2>
        <div className="grid gap-4">
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

      {/* Mobile-optimized CTA */}
      <div className="px-4 py-8 safe-bottom">
        <div className="bg-amber-600 rounded-xl p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-3">
            Ready to Transform Your Barbershop?
          </h2>
          <p className="text-amber-100 text-sm mb-4">
            Join BarberBook today and streamline your booking process, attract more clients, and grow your business.
          </p>
          <Link to="/signup?type=barber">
            <Button variant="secondary" className="w-full py-3">
              Join as a Barber
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}