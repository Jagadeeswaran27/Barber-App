import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../lib/firebase';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { LoadingButton } from '../components/LoadingButton';
import { Toast } from '../components/Toast';
import { MapPin, Upload, Image as ImageIcon } from 'lucide-react';

interface LocationState {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export function ShopSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, name, phone } = location.state as LocationState;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    shopName: '',
    location: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, userId: string) => {
    const storage = getStorage();
    const imageRef = ref(storage, `shops/${userId}/profile`);
    await uploadBytes(imageRef, file);
    return getDownloadURL(imageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) {
      setError('Please select a shop image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create user account
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Send verification email
      await sendEmailVerification(user);

      // Upload image and get URL
      const imageUrl = await uploadImage(selectedImage, user.uid);
      
      // Generate shop code
      const shopCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email,
        name,
        phone,
        type: 'barber',
        createdAt: new Date().toISOString()
      });

      // Create shop document
      await setDoc(doc(db, 'shops', user.uid), {
        name: formData.shopName,
        image: imageUrl,
        location: formData.location,
        ownerId: user.uid,
        code: shopCode,
        createdAt: new Date().toISOString()
      });
      
       await signOut(auth);
      // Show success toast and redirect to login
      setShowSuccessToast(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Shop Setup</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Shop Name"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Enter your shop name"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              {imagePreview ? (
                <div className="relative aspect-video">
                  <img
                    src={imagePreview}
                    alt="Shop preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                    <p className="text-white text-sm">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to upload shop image
                  </p>
                  <p className="text-xs text-gray-400">
                    Maximum size: 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter shop location"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-shadow border-gray-300 focus:ring-amber-500"
                required
              />
              <button
                type="button"
                className="p-2 border rounded-lg hover:bg-gray-50"
                title="Get current location"
              >
                <MapPin className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <LoadingButton type="submit" loading={loading} className="w-full">
            Complete Setup
          </LoadingButton>
        </form>

        {showSuccessToast && (
          <Toast
            message="Account created! Please check your email for verification."
            onClose={() => setShowSuccessToast(false)}
            duration={2000}
          />
        )}
      </div>
    </AuthLayout>
  );
}