import { useState } from 'react';
import { Input } from '../Input';
import { LoadingButton } from '../LoadingButton';
import { AlertCircle } from 'lucide-react';

interface OfferCodeInputProps {
  onSubmit: (code: string) => Promise<void>;
  error?: string | null;
  onErrorClear?: () => void;
}

export function OfferCodeInput({ onSubmit, error, onErrorClear }: OfferCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(code.trim().toUpperCase());
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Offer Code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
          if (onErrorClear) {
            onErrorClear();
          }
        }}
        placeholder="Enter offer code"
        disabled={loading}
        error={error}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded animate-shake">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <LoadingButton
        type="submit"
        loading={loading}
        disabled={!code.trim()}
        className="w-full"
      >
        Redeem Code
      </LoadingButton>
    </form>
  );
}