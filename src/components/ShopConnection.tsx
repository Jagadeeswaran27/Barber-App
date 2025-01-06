import { useState } from 'react';
import { Input } from './Input';
import { LoadingButton } from './LoadingButton';
import { ShopCard } from './ShopCard';

interface ShopConnectionProps {
  onConnect: (code: string) => Promise<void>;
  onDisconnect: (id: string) => Promise<void>;
  shops: Array<{
    id: string;
    shopId: string;
    shopCode: string;
  }>;
}

export function ShopConnection({ onConnect, onDisconnect, shops }: ShopConnectionProps) {
  const [shopCode, setShopCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onConnect(shopCode);
      setShopCode('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to connect to shop');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Shop Code"
          value={shopCode}
          onChange={(e) => setShopCode(e.target.value)}
          placeholder="Enter shop code"
          disabled={loading}
        />
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        <LoadingButton
          type="submit"
          loading={loading}
          disabled={!shopCode.trim()}
        >
          Connect to Shop
        </LoadingButton>
      </form>

      {shops.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Connected Shops</h3>
          <div className="grid gap-3">
            {shops.map((shop) => (
              <ShopCard
                key={shop.id}
                connectionId={shop.id}
                shopId={shop.shopId}
                shopCode={shop.shopCode}
                onDisconnect={onDisconnect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}