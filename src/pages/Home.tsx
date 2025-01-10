import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { FeatureCard } from '../components/FeatureCard';
import { Logo } from '../components/Logo';
import { Scissors, Tag, MessageSquare } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="px-4 py-3 flex items-center justify-between safe-top">
          <Logo className="scale-90" />
          <div className="flex gap-2">
            <Link to="/login">
              <Button variant="secondary" className="text-sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="text-sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="px-4 pt-28 pb-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Manage Your Beauty Business
          </h1>
          <p className="text-gray-600 mb-6">
            Connect with clients, manage offers, and grow your business
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/signup">
              <Button className="w-full">
                Get Started
              </Button>
            </Link>
            <Link to="/signup?type=barber">
              <Button variant="secondary" className="w-full">
                I'm a Professional
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-8">
        <div className="grid gap-4">
          <FeatureCard
            icon={Scissors}
            title="For Beauty Professionals"
            description="Perfect for barbers, beauticians, and beauty experts"
          />
          <FeatureCard
            icon={Tag}
            title="Manage Offers"
            description="Create and manage special offers for your clients"
          />
          <FeatureCard
            icon={MessageSquare}
            title="Client Communication"
            description="Stay connected with your clients through chat"
          />
        </div>
      </div>
    </div>
  );
}