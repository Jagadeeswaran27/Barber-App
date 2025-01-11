import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
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
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();

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
          phone: formData.phone,
          type: 'customer',
          createdAt: new Date().toISOString()
        });

        // Sign out the user immediately
        await signOut(auth);
        
        // Show success toast and redirect after a delay
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={loading}
          pattern="[0-9]{10}"
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

      {showSuccessToast && (
        <Toast
          message="Account created successfully! Please check your email for verification."
          onClose={() => setShowSuccessToast(false)}
          duration={2000}
        />
      )}
    </>
  );
}