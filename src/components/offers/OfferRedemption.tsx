import { useState } from 'react';
import { QRCodeScanner } from './QRCodeScanner';
import { Button } from '../Button';
import { ScanLine, AlertCircle } from 'lucide-react';
import { useOfferRedemption } from '../../hooks/useOfferRedemption';
import { getOfferValidationError } from '../../utils/offerValidation';
import type { Offer } from '../../types/offer';

interface OfferRedemptionProps {
  offer: Offer;
  customerId: string;
  onRedeem: () => void;
}

export function OfferRedemption({ offer, customerId, onRedeem }: OfferRedemptionProps) {
  const [showScanner, setShowScanner] = useState(false);
  const { redeemOffer, loading, error: redemptionError } = useOfferRedemption(offer.id, customerId);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleScan = async (scannedCode: string) => {
    setValidationError(null);
    
    try {
      // Validate the scanned QR code
      const error = getOfferValidationError(scannedCode, offer);
      if (error) {
        setValidationError(error);
        return;
      }

      await redeemOffer(offer.shopId);
      setShowScanner(false);
      onRedeem();
    } catch (err) {
      console.error('Redemption error:', err);
    }
  };

  const error = validationError || redemptionError;

  return (
    <div className="space-y-2">
      <Button
        onClick={() => {
          setShowScanner(true);
          setValidationError(null);
        }}
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        <ScanLine className="h-5 w-5" />
        Scan QR Code
      </Button>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {showScanner && (
        <QRCodeScanner
          onScan={handleScan}
          onClose={() => {
            setShowScanner(false);
            setValidationError(null);
          }}
        />
      )}
    </div>
  );
}