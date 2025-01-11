import { useState } from 'react';
import { Calendar, QrCode, Copy, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '../Button';
import { OfferRedemption } from './OfferRedemption';
import { Toast } from '../Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useOfferRedemptions } from '../../hooks/useOfferRedemptions';
import type { Offer } from '../../types/offer';

interface OfferCardProps {
  offer: Offer;
  onToggleStatus?: (offerId: string, active: boolean) => Promise<void>;
  showActions?: boolean;
  onRedeem?: () => Promise<void>;
}

export function OfferCard({ 
  offer, 
  onToggleStatus,
  showActions = false,
  onRedeem 
}: OfferCardProps) {
  const { user } = useAuth();
  const { isOfferRedeemed } = useOfferRedemptions(user?.id || '');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActive = () => {
    if (!offer.active) return false;
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    return now >= start && now <= end;
  };

  const getStatusColor = () => {
    if (!offer.active) return 'bg-gray-100 text-gray-800';
    if (isActive()) return 'bg-green-100 text-green-800';
    return 'bg-amber-100 text-amber-800';
  };

  const getStatusText = () => {
    if (!offer.active) return 'Inactive';
    if (isActive()) return 'Active';
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    return now < start ? 'Scheduled' : 'Expired';
  };

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onToggleStatus || updating) return;
    
    setUpdating(true);
    try {
      await onToggleStatus(offer.id, !offer.active);
      setStatusMessage(offer.active ? 'Offer marked as inactive' : 'Offer marked as active');
      setShowStatusToast(true);
      setTimeout(() => setShowStatusToast(false), 3000);
    } finally {
      setUpdating(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = async () => {
    if (onRedeem) {
      await onRedeem();
      setShowSuccessToast(true);
    }
  };

  const isRedeemed = user?.type === 'customer' && isOfferRedeemed(offer.id);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
        {showActions && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleToggleStatus}
              className={`p-1 rounded-lg transition-all ${
                updating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
              }`}
              disabled={updating}
              title={offer.active ? 'Mark as inactive' : 'Mark as active'}
            >
              {offer.active ? (
                <ToggleRight className="h-6 w-6 text-green-600" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-gray-400" />
              )}
            </button>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 pr-20">
            {offer.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-end mt-4">
            <span className={`${getStatusColor()} text-sm px-3 py-1 rounded-full`}>
              {getStatusText()}
            </span>
          </div>

          {/* Show QR code and offer code for barbers */}
          {user?.type === 'barber' && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded">
                <code className="font-mono text-sm text-gray-600">
                  {offer.code}
                </code>
                <button
                  onClick={copyCode}
                  className="text-gray-400 hover:text-amber-600 transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {showQR ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <img 
                      src={offer.qrCode} 
                      alt="Offer QR Code"
                      className="mx-auto max-w-[200px] w-full"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowQR(false)}
                  >
                    Hide QR Code
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setShowQR(true)}
                >
                  <QrCode className="h-5 w-5" />
                  Show QR Code
                </Button>
              )}
            </div>
          )}

          {/* Show redemption UI for customers */}
          {user?.type === 'customer' && onRedeem && isActive() && !isRedeemed && (
            <div className="mt-4 pt-4 border-t">
              <OfferRedemption
                offer={offer}
                customerId={user.id}
                onRedeem={handleRedeem}
              />
            </div>
          )}

          {isRedeemed && (
            <div className="mt-4 pt-4 border-t text-center text-green-600 text-sm">
              You have already redeemed this offer
            </div>
          )}
        </div>
      </div>

      {showSuccessToast && (
        <Toast
          message="Offer redeemed successfully!"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {showStatusToast && (
        <Toast
          message={statusMessage}
          onClose={() => setShowStatusToast(false)}
        />
      )}
    </>
  );
}