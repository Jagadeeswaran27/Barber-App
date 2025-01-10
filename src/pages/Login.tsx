import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthLayout } from '../components/AuthLayout';
import { LoadingButton } from '../components/LoadingButton';
import { Input } from '../components/Input';
import { initializePushNotifications } from '../utils/fcm';
import { isNative } from '../utils/platform';

export function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Check email verification
      if (!firebaseUser.emailVerified) {
        try {
          await sendEmailVerification(firebaseUser);
          await signOut(auth);
          setError('Please verify your email before logging in. A new verification email has been sent.');
        } catch (verificationError: any) {
          if (verificationError.code === 'auth/too-many-requests') {
            await signOut(auth);
            setError('Please verify your email before logging in. Check your inbox for the verification email.');
          } else {
            console.error('Verification error:', verificationError);
            setError('Please verify your email before logging in.');
          }
        }
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.data();

      if (userData) {
        // Initialize push notifications for customers
        if (userData.type === 'customer') {
          await initializePushNotifications(firebaseUser.uid);
        }
        navigate(userData.type === 'customer' ? '/dashboard' : '/shop');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="username"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="current-password"
          />

          <LoadingButton type="submit" loading={loading} className="w-full">
            Login
          </LoadingButton>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber-600 hover:text-amber-700">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}