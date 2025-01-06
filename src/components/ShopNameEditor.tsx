import { useState } from 'react';
import { Input } from './Input';
import { LoadingButton } from './LoadingButton';

interface ShopNameEditorProps {
  currentName: string;
  onSave: (name: string) => Promise<void>;
}

export function ShopNameEditor({ currentName, onSave }: ShopNameEditorProps) {
  const [name, setName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(name);
    } catch (err) {
      setError('Failed to update shop name');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Shop Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your shop name"
        disabled={loading}
      />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <LoadingButton
        type="submit"
        loading={loading}
        disabled={!name.trim() || name === currentName}
      >
        Save Name
      </LoadingButton>
    </form>
  );
}