import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center px-8 pt-20">
        {/* Logo */}
        <div className="mb-auto">
          <Logo className="text-white scale-150" />
        </div>

        {/* White curved section with buttons */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="relative">
            {/* Curved white background */}
            <div 
              className="absolute top-0 left-0 right-0 h-32 bg-white"
              style={{
                borderTopLeftRadius: '3rem',
                borderTopRightRadius: '3rem',
                transform: 'translateY(-45%)'
              }}
            />
            
            {/* Buttons container */}
            <div className="relative bg-white px-6 pb-12 space-y-4">
              {/* Welcome Text and Description */}
              <div className="pt-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Welcome
                </h1>
                <p className="text-gray-600 text-lg mb-8 px-4">
                  The ultimate platform for barbers, beauticians, and salon professionals to manage their business
                </p>
              </div>

              <Link 
                to="/login" 
                className="block w-full py-4 text-center text-xl font-semibold text-gray-900 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Sign In
              </Link>
              
              <Link 
                to="/signup"
                className="block w-full py-4 text-center text-xl font-semibold text-white bg-amber-500 rounded-2xl hover:bg-amber-600 transition-colors"
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