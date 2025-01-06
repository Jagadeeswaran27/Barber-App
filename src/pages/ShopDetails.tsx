import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useShopDetails } from '../hooks/useShopDetails';
import { useShopOffers } from '../hooks/useShopOffers';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { WorkingHoursDisplay } from '../components/WorkingHoursDisplay';
import { OffersList } from '../components/offers/OffersList';
import { ChatSection } from '../components/chat/ChatSection';
import { Scissors, Clock, Tag, Store, MessageSquare } from 'lucide-react';

const DEFAULT_HOURS = {
  Monday: { open: '09:00', close: '17:00', closed: false },
  Tuesday: { open: '09:00', close: '17:00', closed: false },
  Wednesday: { open: '09:00', close: '17:00', closed: false },
  Thursday: { open: '09:00', close: '17:00', closed: false },
  Friday: { open: '09:00', close: '17:00', closed: false },
  Saturday: { open: '09:00', close: '17:00', closed: false },
  Sunday: { open: '09:00', close: '17:00', closed: true },
};

type ActiveTab = 'details' | 'chat';

export function ShopDetails() {
  const { shopId } = useParams();
  const { shopDetails, loading, error } = useShopDetails(shopId || '');
  const { offers, loading: offersLoading, redeemOffer } = useShopOffers(shopId || '');
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Shop Details Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Store className="h-5 w-5 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {shopDetails?.name || 'Unnamed Shop'}
                </h2>
              </div>
              <code className="text-sm text-gray-500 font-mono mt-1 block">
                Shop Code: {shopDetails?.code}
              </code>
            </div>
            
            {/* Working Hours Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Working Hours</h3>
              </div>
              <WorkingHoursDisplay hours={shopDetails?.workingHours || DEFAULT_HOURS} />
            </div>

            {/* Offers Section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Special Offers</h3>
              </div>
              {offersLoading ? (
                <div className="flex items-center justify-center p-4">
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
          </div>
        );
      case 'chat':
        return shopId ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold">Chat with Shop</h3>
            </div>
            <ChatSection shopId={shopId} />
          </div>
        ) : null;
    }
  };

  return (
    <DashboardLayout title={shopDetails?.name || 'Shop Details'}>
      <div className="mb-6 border-b">
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

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Scissors className="h-6 w-6 animate-spin text-amber-600" />
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : shopDetails && (
          renderTabContent()
        )}
      </div>
    </DashboardLayout>
  );
}