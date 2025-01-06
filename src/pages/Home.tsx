import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { FeatureCard } from '../components/FeatureCard';
import { Logo } from '../components/Logo';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>
        <div className="flex gap-2 sm:gap-4">
          <Link to="/login">
            <Button variant="secondary" className="text-sm sm:text-base px-3 sm:px-6">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="text-sm sm:text-base px-3 sm:px-6">Sign Up</Button>
          </Link>
        </div>
      </nav>
      {/* Rest of the component remains the same */}
    </div>
  );
}