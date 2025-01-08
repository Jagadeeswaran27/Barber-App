import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShopData } from '../hooks/useShopData';
import { useShopStats } from '../hooks/useShopStats';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { BarberChatSection } from '../components/chat/BarberChatSection';
import { BottomNav } from '../components/BottomNav';
import { ShopOffers } from './ShopOffers';
import { Camera, MapPin, Scissors, Copy, CheckCircle2, Mail } from 'lucide-react';

type ActiveTab = 'details' | 'offers' | 'chat';

export default function ShopDashboard() {
  const { user } = useAuth();
  const { shopData, loading } = useShopData(user?.id || '');
  const { stats, loading: statsLoading } = useShopStats(user?.id || '');
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
          <div className="space-y-6 mt-4">
            {/* Shop Banner with Overlay */}
            <div className="relative h-48 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg overflow-hidden">
              {shopData?.image ? (
                <>
                  <img
                    src={shopData.image}
                    alt={shopData.name}
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
                  {shopData?.name || 'Unnamed Shop'}
                </h2>
                {shopData?.location && (
                  <div className="flex items-center gap-1.5 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">{shopData.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {statsLoading ? '-' : stats.customerCount}
                </p>
                <p className="text-sm text-gray-600">Customers</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {statsLoading ? '-' : stats.activeOffersCount}
                </p>
                <p className="text-sm text-gray-600">Active Offers</p>
              </div>
            </div>

            {/* Shop Details Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-6">
                {/* Shop Code Section */}
                <div>
                  <label className="text-sm text-gray-500">Shop Code</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 font-mono text-lg bg-gray-50 px-3 py-1.5 rounded-lg">
                      {shopData?.code}
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

                {/* Barber Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Scissors className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'offers':
        return <ShopOffers />;

      case 'chat':
        return (
          <div className="mt-4">
            <BarberChatSection shopId={user.id} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout title={`Welcome, ${user.name}`}>
      {/* Desktop Tabs */}
      <div className="mb-4 border-b hidden lg:block">
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

      {/* Content */}
      <div className="pb-20 lg:pb-0">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Scissors className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Mobile Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </DashboardLayout>
  );
}