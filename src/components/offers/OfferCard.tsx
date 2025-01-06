import { useState } from 'react';
import { Percent, Calendar, Trash2, QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '../Button';
import { OfferRedemption } from './OfferRedemption';
import { Toast } from '../Toast';
import { useAuth } from '../../contexts/AuthContext';
import { useOfferRedemptions } from '../../hooks/useOfferRedemptions';
import type { Offer } from '../../types/offer';

interface OfferCardProps {
  offer: Offer;
  onDelete?: (offerId: string) => Promise<void>;
  showActions?: boolean;
  onRedeem?: () => Promise<void>;
}

export function OfferCard({ 
  offer, 
  onDelete, 
  showActions = false,
  onRedeem 
}: OfferCardProps) {
  const { user } = useAuth();
  const { isOfferRedeemed } = useOfferRedemptions(user?.id || '');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

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
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    return now >= start && now <= end;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete) {
      await onDelete(offer.id);
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
          <button
            onClick={handleDelete}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 rounded-lg p-2">
              <Percent className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {offer.title}
              </h3>
              <p className="text-gray-600">{offer.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold text-amber-600">
              {offer.discount}% OFF
            </span>
            {isActive() ? (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Active
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                Inactive
              </span>
            )}
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
          message={`Successfully redeemed ${offer.discount}% discount!`}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
    </>
  );
}