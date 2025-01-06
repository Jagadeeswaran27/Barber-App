import { useState } from 'react';
import { QrCode, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../Button';
import type { Offer, OfferRedemption } from '../../types/offer';

interface OfferQRCodeProps {
  offer: Offer;
  onRedeem?: (offerId: string) => Promise<void>;
  redemption?: OfferRedemption | null;
}

export function OfferQRCode({ offer, onRedeem, redemption }: OfferQRCodeProps) {
  const [showQR, setShowQR] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');

  const handleRedeem = async () => {
    if (!onRedeem) return;
    
    setRedeeming(true);
    setError('');
    
    try {
      await onRedeem(offer.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem offer');
    } finally {
      setRedeeming(false);
    }
  };

  const isRedeemable = () => {
    if (redemption) return false;
    
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    
    return now >= start && now <= end && offer.redemptions < offer.maxRedemptions;
  };

  return (
    <div className="mt-4">
      {showQR ? (
        <div className="space-y-4">
          <img 
            src={offer.qrCode} 
            alt="Offer QR Code"
            className="mx-auto"
          />
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowQR(false)}
          >
            Hide QR Code
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {redemption ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span>Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString()}</span>
            </div>
          ) : isRedeemable() ? (
            <>
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowQR(true)}
              >
                <QrCode className="h-5 w-5" />
                Show QR Code
              </Button>
              <Button
                className="w-full"
                onClick={handleRedeem}
                disabled={redeeming}
              >
                Redeem Now
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <XCircle className="h-5 w-5" />
              <span>
                {offer.redemptions >= offer.maxRedemptions 
                  ? 'No more redemptions available' 
                  : 'Offer not active'}
              </span>
            </div>
          )}
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-500 text-center">
        {offer.redemptions} / {offer.maxRedemptions} redeemed
      </div>
    </div>
  );
}