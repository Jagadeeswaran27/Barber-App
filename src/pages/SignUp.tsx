import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { SignUpForm } from '../components/SignUpForm';
import { Button } from '../components/Button';

export function SignUp() {
  const [isBarber, setIsBarber] = useState(false);

  return (
    <AuthLayout>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          {isBarber ? 'Create Your Admin Account' : 'Create Your Account'}
        </h2>
        
        <div className="flex gap-4 justify-center mb-6">
          <Button 
            variant={!isBarber ? 'primary' : 'secondary'}
            className="text-sm"
            onClick={() => setIsBarber(false)}
          >
            Sign up as Customer
          </Button>
          <Button 
            variant={isBarber ? 'primary' : 'secondary'}
            className="text-sm"
            onClick={() => setIsBarber(true)}
          >
            Sign up as Admin
          </Button>
        </div>

        <SignUpForm userType={isBarber ? 'barber' : 'customer'} />

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 hover:text-amber-700">
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}