import { useAuth } from '../contexts/AuthContext';
import { useShopPrices } from '../hooks/useShopPrices';
import { PriceList } from '../components/prices/PriceList';
import { Scissors } from 'lucide-react';

export function ShopPrices() {
  const { user } = useAuth();
  const { prices, loading, createPrice, deletePrice } = useShopPrices(user?.id || '');

  if (!user) return null;

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Scissors className="h-6 w-6 animate-spin text-amber-600" />
        </div>
      ) : (
        <PriceList
          prices={prices}
          onCreatePrice={createPrice}
          onDeletePrice={deletePrice}
        />
      )}
    </div>
  );
}