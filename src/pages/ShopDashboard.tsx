import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShopData } from '../hooks/useShopData';
import { useShopManagement } from '../hooks/useShopManagement';
import { useShopOffers } from '../hooks/useShopOffers';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ShopNameEditor } from '../components/ShopNameEditor';
import { WorkingHoursEditor } from '../components/WorkingHoursEditor';
import { OffersList } from '../components/offers/OffersList';
import { BarberChatSection } from '../components/chat/BarberChatSection';
import { Scissors, Tag, Store, Clock, MessageSquare, Copy, CheckCircle2 } from 'lucide-react';

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

export function ShopDashboard() {
  const { user } = useAuth();
  const { shopData, loading, error } = useShopData(user?.id || '');
  const { updateShopName, updateWorkingHours } = useShopManagement(user?.id || '');
  const { offers, loading: offersLoading, createOffer, deleteOffer } = useShopOffers(user?.id || '');
  const [activeTab, setActiveTab] = useState<ActiveTab>('details');
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const handleCopyCode = async () => {
    if (shopData?.code) {
      await navigator.clipboard.writeText(shopData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Shop Code Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Your Shop Code</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex items-stretch">
                    <code className="flex-1 bg-white px-4 py-2 rounded-l-lg border border-r-0 border-amber-200 text-lg font-mono">
                      {shopData?.code}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="px-4 bg-white border border-l-0 border-amber-200 rounded-r-lg hover:bg-amber-50 transition-colors flex items-center gap-2"
                      title="Copy code"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-amber-600" />
                      )}
                    </button>
                  </div>
                  <p className="text-amber-700 text-sm flex-shrink-0">
                    Share this code with your customers
                  </p>
                </div>
              </div>
            </div>

            {/* Shop Name Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <Store className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Shop Name</h3>
              </div>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Scissors className="h-6 w-6 animate-spin text-amber-600" />
                </div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                <ShopNameEditor
                  currentName={shopData?.name || ''}
                  onSave={updateShopName}
                />
              )}
            </div>

            {/* Working Hours Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="h-5 w-5 text-amber-600" />
                <h3 className="text-lg font-semibold">Working Hours</h3>
              </div>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Scissors className="h-6 w-6 animate-spin text-amber-600" />
                </div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                <WorkingHoursEditor
                  hours={shopData?.workingHours || DEFAULT_HOURS}
                  onSave={updateWorkingHours}
                />
              )}
            </div>

            {/* Offers Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-6">
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
                  onCreateOffer={createOffer}
                  onDeleteOffer={deleteOffer}
                  showActions
                />
              )}
            </div>
          </div>
        );

      case 'chat':
        return user.id ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              <h3 className="text-lg font-semibold">Customer Messages</h3>
            </div>
            <BarberChatSection shopId={user.id} />
          </div>
        ) : null;
    }
  };

  return (
    <DashboardLayout title={`Welcome to your shop, ${user.name}`}>
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
            Messages
          </button>
        </div>
      </div>

      {renderTabContent()}
    </DashboardLayout>
  );
}