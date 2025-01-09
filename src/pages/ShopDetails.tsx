import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useShopDetails } from '../hooks/useShopDetails';
import { useShopOffers } from '../hooks/useShopOffers';
import { useShopPrices } from '../hooks/useShopPrices';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { OffersList } from '../components/offers/OffersList';
import { CustomerPriceList } from '../components/prices/CustomerPriceList';
import { ChatSection } from '../components/chat/ChatSection';
import { BottomNav } from '../components/BottomNav';
import { Scissors, Tag, Store, MessageSquare, Camera, MapPin, IndianRupee, Clock, Copy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type ActiveTab = 'details' | 'offers' | 'chat' | 'prices';

export function ShopDetails() {
  const { user } = useAuth();
  const { shopId } = useParams();
  const { shopDetails, loading, error } = useShopDetails(shopId || '');
  const { offers, loading: offersLoading, redeemOffer } = useShopOffers(shopId || '');
  const { prices, loading: pricesLoading } = useShopPrices(shopId || '');
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  const [copied, setCopied] = useState(false);

  // Check for stored tab preference on mount
  useEffect(() => {
    const storedTab = sessionStorage.getItem('activeTab');
    if (storedTab === 'offers' || storedTab === 'prices' || storedTab === 'chat') {
      setActiveTab(storedTab as ActiveTab);
      sessionStorage.removeItem('activeTab');
    }
  }, []);

  const handleCopyCode = async () => {
    if (shopDetails?.code) {
      await navigator.clipboard.writeText(shopDetails.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Shop Banner */}
            <div className="relative h-48 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg overflow-hidden">
              {shopDetails?.image ? (
                <>
                  <img
                    src={shopDetails.image}
                    alt={shopDetails.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-amber-300" />
                </div>
              )}
              
              {/* Shop Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-xl font-bold mb-1">
                  {shopDetails?.name || 'Unnamed Shop'}
                </h2>
                {shopDetails?.location && (
                  <div className="flex items-center gap-1.5 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{shopDetails.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shop Details */}
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
              {/* Basic Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Store className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium">About the Shop</h3>
                </div>
                {shopDetails?.description ? (
                  <p className="text-gray-600">{shopDetails.description}</p>
                ) : (
                  <p className="text-gray-500 text-sm italic">No description available</p>
                )}
              </div>

              {/* Shop Code */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Shop Code</h3>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-lg bg-gray-50 px-3 py-1.5 rounded-lg">
                    {shopDetails?.code}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy code"
                  >
                    {copied ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Working Hours */}
              {shopDetails?.workingHours && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <h3 className="font-medium">Working Hours</h3>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(shopDetails.workingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{day}</span>
                        <span className="text-gray-900">
                          {hours?.closed ? 'Closed' : `${hours?.open} - ${hours?.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'offers':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold">Special Offers</h3>
            </div>
            {offersLoading ? (
              <div className="flex items-center justify-center p-8">
                <Scissors className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : (
              <OffersList
                offers={offers}
                onCreateOffer={() => {}}
                onDeleteOffer={() => {}}
                onRedeemOffer={redeemOffer}
              />
            )}
          </div>
        );

      case 'prices':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold">Service Prices</h3>
            </div>
            {pricesLoading ? (
              <div className="flex items-center justify-center p-8">
                <Scissors className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : (
              <CustomerPriceList prices={prices} />
            )}
          </div>
        );

      case 'chat':
        return shopId ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold">Chat with Shop</h3>
            </div>
            <ChatSection shopId={shopId} />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title={shopDetails?.name || 'Shop Details'}>
      {/* Desktop Tabs */}
      <div className="mb-6 border-b hidden lg:block">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'details'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            Shop Details
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'offers'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            Offers
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'prices'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            Prices
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'chat'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-amber-600'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20 lg:pb-0">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Scissors className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-8">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {renderTabContent()}
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </DashboardLayout>
  );
}