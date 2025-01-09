import { useState } from 'react';
import { Input } from '../Input';
import { LoadingButton } from '../LoadingButton';

interface PriceFormData {
  name: string;
  price: number;
  duration?: number;
}

interface PriceFormProps {
  onSubmit: (data: PriceFormData) => Promise<void>;
}

export function PriceForm({ onSubmit }: PriceFormProps) {
  const [formData, setFormData] = useState<PriceFormData>({
    name: '',
    price: 0,
    duration: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        price: 0,
        duration: 30,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add price item');
    } finally {
      setLoading(false);
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
        label="Service Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="e.g., Men's Haircut"
      />

      <Input
        label="Price (₹)"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        required
        min={0}
      />

      <Input
        label="Duration (Minutes)"
        type="number"
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        required
        min={5}
        step={5}
      />

      <LoadingButton type="submit" loading={loading}>
        Add Service
      </LoadingButton>
    </form>
  );
}