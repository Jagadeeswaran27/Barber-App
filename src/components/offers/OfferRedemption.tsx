import { useState, useEffect } from 'react';
import { QRCodeScanner } from './QRCodeScanner';
import { OfferCodeInput } from './OfferCodeInput';
import { Button } from '../Button';
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
  const [success, setSuccess] = useState(false);
  const { redeemOffer, loading } = useOfferRedemption(offer.id, customerId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (success) {
      timeout = setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [success]);

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
      await redeemOffer(offer.shopId);
      await onRedeem();
      setMode(null);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to redeem offer';
      setError(errorMessage);
      // Close scanner if in scan mode
      if (mode === 'scan') {
        setMode(null);
      }
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded animate-fade-in">
        <CheckCircle2 className="h-5 w-5" />
        <span>Offer successfully redeemed!</span>
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
  );
}