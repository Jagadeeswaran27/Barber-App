import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { LoadingButton } from './LoadingButton';
import { Input } from './Input';
import { Toast } from './Toast';

interface SignUpFormProps {
  userType: 'barber' | 'customer';
}

export function SignUpForm({ userType }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (userType === 'barber') {
        // For barbers, navigate to shop setup with form data
        navigate('/shop-setup', { state: formData });
      } else {
        // For customers, create account immediately
        const { user } = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );
        
        // Send verification email
        await sendEmailVerification(user);
        
        await setDoc(doc(db, 'users', user.uid), {
          email: formData.email,
          name: formData.name,
          type: 'customer',
          createdAt: new Date().toISOString()
        });

        setShowVerificationMessage(true);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <LoadingButton type="submit" loading={loading} className="w-full">
          {userType === 'barber' ? 'Continue to Shop Setup' : 'Sign Up'}
        </LoadingButton>
      </form>

      {showVerificationMessage && (
        <Toast
          message="Please check your email to verify your account. Redirecting to login..."
          onClose={() => setShowVerificationMessage(false)}
          duration={5000}
        />
      )}
    </>
  );
}