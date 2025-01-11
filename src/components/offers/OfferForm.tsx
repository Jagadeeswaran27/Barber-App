import { useState } from 'react';
import { Input } from '../Input';
import { LoadingButton } from '../LoadingButton';

interface OfferFormData {
  title: string;
  startDate: string;
  endDate: string;
}

interface OfferFormProps {
  onSubmit: (data: OfferFormData) => Promise<void>;
}

export function OfferForm({ onSubmit }: OfferFormProps) {
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateDates = () => {
    const start = new Date(formData.startDate).getTime();
    const end = new Date(formData.endDate).getTime();

    if (start >= end) {
      throw new Error('End date must be after start date');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      validateDates();
      await onSubmit(formData);
      setFormData({
        title: '',
        startDate: '',
        endDate: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create offer');
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
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <Input
        label="Start Date"
        type="datetime-local"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <Input
        label="End Date"
        type="datetime-local"
        name="endDate"
        min={formData.startDate}
        value={formData.endDate}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <LoadingButton type="submit" loading={loading}>
        Create Offer
      </LoadingButton>
    </form>
  );
}