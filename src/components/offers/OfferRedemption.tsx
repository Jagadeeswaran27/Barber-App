import { useState } from 'react';
import { QRCodeScanner } from './QRCodeScanner';
import { OfferCodeInput } from './OfferCodeInput';
import { Button } from '../Button';
import { Toast } from '../Toast';
import { ScanLine, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useOfferRedemption } from '../../hooks/useOfferRedemption';
import { getOfferValidationError } from '../../utils/offerValidation';
import type { Offer } from '../../types/offer';

interface OfferRedemptionProps {
  offer: Offer;
  customerId: string;
  onRedeem: () => Promise<void>;
}

export function OfferRedemption({ offer, customerId, onRedeem }: OfferRedemptionProps) {
  const [mode, setMode] = useState<'scan' | 'manual' | null>(null);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const { redeemOffer, loading } = useOfferRedemption(offer.id, customerId);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showScanSuccessToast, setShowScanSuccessToast] = useState(false);

  const handleRedeem = async (code: string) => {
    setError(null);
    
    // Validate the code
    const validationError = getOfferValidationError(code, offer);
    if (validationError) {
      setError(validationError);
      // Close scanner if in scan mode
      if (mode === 'scan') {
        setMode(null);
      }
      return;
    }

    try {
      // Show scan success toast first
      if (mode === 'scan') {
        setShowScanSuccessToast(true);
        // Close scanner
        setMode(null);
        // Wait for toast to show before proceeding
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await redeemOffer(offer.shopId);
      await onRedeem();
      setMode(null);
      setIsRedeemed(true);
      setShowToast(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to redeem offer';
      setError(errorMessage);
      // Close scanner if in scan mode
      if (mode === 'scan') {
        setMode(null);
      }
    }
  };

  if (isRedeemed) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">Offer Successfully Redeemed!</p>
          <p className="text-sm text-green-700 mt-1">
            You've claimed {offer.discount}% off
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'scan') {
    return (
      <div className="space-y-4">
        <QRCodeScanner
          onScan={handleRedeem}
          onClose={() => {
            setMode(null);
            setError(null);
          }}
        />
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded animate-shake">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <div className="space-y-4">
        <OfferCodeInput 
          onSubmit={handleRedeem}
          error={error}
          onErrorClear={() => setError(null)}
        />
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setMode(null);
            setError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Button
          onClick={() => setMode('scan')}
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          <ScanLine className="h-5 w-5" />
          Scan QR Code
        </Button>

        <Button
          onClick={() => setMode('manual')}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2"
          disabled={loading}
        >
          <KeyRound className="h-5 w-5" />
          Enter Code Manually
        </Button>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded animate-shake">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {showScanSuccessToast && (
        <Toast 
          message="QR code scanned successfully!" 
          onClose={() => setShowScanSuccessToast(false)}
          duration={2000}
        />
      )}

      {showToast && (
        <Toast 
          message="Offer redeemed successfully!" 
          onClose={() => setShowToast(false)} 
        />
      )}
    </>
  );
}