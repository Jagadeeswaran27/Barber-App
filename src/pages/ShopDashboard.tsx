import { useAuth } from '../contexts/AuthContext';
import { useShopData } from '../hooks/useShopData';
import { useShopManagement } from '../hooks/useShopManagement';
import { useShopOffers } from '../hooks/useShopOffers';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ShopNameEditor } from '../components/ShopNameEditor';
import { WorkingHoursEditor } from '../components/WorkingHoursEditor';
import { OffersList } from '../components/offers/OffersList';
import { Scissors, Tag, Store, Clock } from 'lucide-react';

const DEFAULT_HOURS = {
  Monday: { open: '09:00', close: '17:00', closed: false },
  Tuesday: { open: '09:00', close: '17:00', closed: false },
  Wednesday: { open: '09:00', close: '17:00', closed: false },
  Thursday: { open: '09:00', close: '17:00', closed: false },
  Friday: { open: '09:00', close: '17:00', closed: false },
  Saturday: { open: '09:00', close: '17:00', closed: false },
  Sunday: { open: '09:00', close: '17:00', closed: true },
};

export function ShopDashboard() {
  const { user } = useAuth();
  const { shopData, loading, error } = useShopData(user?.id || '');
  const { updateShopName, updateWorkingHours } = useShopManagement(user?.id || '');
  const { 
    offers, 
    loading: offersLoading, 
    createOffer, 
    deleteOffer 
  } = useShopOffers(user?.id || '');

  if (!user) return null;

  return (
    <DashboardLayout title={`Welcome to your shop, ${user.name}`}>
      <div className="space-y-6">
        {/* Shop Code Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Your Shop Code</h3>
            <div className="flex items-center gap-2">
              <code className="bg-white px-4 py-2 rounded border border-amber-300 text-lg font-mono">
                {shopData?.code}
              </code>
              <p className="text-amber-700 text-sm">
                Share this code with your customers to let them find your shop
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
    </DashboardLayout>
  );
}