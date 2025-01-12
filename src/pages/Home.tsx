import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import barberIllustration from '../assets/barber.svg';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500 to-amber-600 relative overflow-hidden">
      {/* Illustration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img 
          src={barberIllustration}
          alt="Barber illustration"
          className="w-full max-w-4xl"
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center px-6 sm:px-8 pt-16 sm:pt-20">
        {/* Logo */}
        <div className="mb-auto">
          <Logo variant="home" className="text-white" />
        </div>

        {/* White curved section with buttons */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative">
            {/* Curved white background */}
            <div 
              className="absolute top-0 left-0 right-0 h-24 bg-white"
              style={{
                borderTopLeftRadius: '3rem',
                borderTopRightRadius: '3rem',
                transform: 'translateY(-45%)'
              }}
            />
            
            {/* Buttons container */}
            <div className="relative bg-white px-4 sm:px-6 pb-8 space-y-3">
              {/* Welcome Text and Description */}
              <div className="pt-12 text-center">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Welcome
                </h1>
                <p className="text-gray-600 text-base sm:text-lg mb-6 px-2 sm:px-4">
                  The ultimate platform for barbers, beauticians, and salon professionals to manage their business
                </p>
              </div>

              <Link 
                to="/login" 
                className="block w-full py-2.5 sm:py-3 text-center text-lg sm:text-xl font-semibold text-gray-900 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Sign In
              </Link>
              
              <Link 
                to="/signup"
                className="block w-full py-2.5 sm:py-3 text-center text-lg sm:text-xl font-semibold text-white bg-amber-600 rounded-2xl hover:bg-amber-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}