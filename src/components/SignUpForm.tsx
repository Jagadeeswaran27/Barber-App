import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from './Button';
import { Input } from './Input';

interface SignUpFormProps {
  userType: 'barber' | 'user';
}

export function SignUpForm({ userType }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        name: formData.name,
        type: userType,
        createdAt: new Date().toISOString()
      });

      if (userType === 'barber') {
        const shopCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        await setDoc(doc(db, 'shops', user.uid), {
          name: '',
          ownerId: user.uid,
          code: shopCode,
          createdAt: new Date().toISOString()
        });
      }

      navigate('/');
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
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
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" className="w-full">
        {userType === 'barber' ? 'Create Barber Account' : 'Sign Up'}
      </Button>
    </form>
  );
}