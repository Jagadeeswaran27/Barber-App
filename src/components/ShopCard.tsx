import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShopDetails } from '../hooks/useShopDetails';
import { Scissors, X, ArrowRight } from 'lucide-react';

interface ShopCardProps {
  shopId: string;
  shopCode: string;
  onDisconnect: (id: string) => Promise<void>;
  connectionId: string;
}

export function ShopCard({ shopId, shopCode, onDisconnect, connectionId }: ShopCardProps) {
  const { shopDetails, loading, error } = useShopDetails(shopId);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking disconnect
    setIsDisconnecting(true);
    try {
      await onDisconnect(connectionId);
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg animate-pulse">
        <div className="flex items-center justify-center">
          <Scissors className="h-5 w-5 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  if (error || !shopDetails) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600 text-sm">Failed to load shop details</p>
      </div>
    );
  }

  return (
    <Link 
      to={`/shop/${shopId}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {shopDetails.name || 'Unnamed Shop'}
          </h3>
          <code className="text-sm text-gray-500 font-mono mt-1 block">
            {shopCode}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
          <ArrowRight className="h-5 w-5 text-amber-600" />
        </div>
      </div>
    </Link>
  );
}