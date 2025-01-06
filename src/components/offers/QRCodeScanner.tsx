import { useEffect } from 'react';
import { Button } from '../Button';
import { Loader2, AlertCircle, Camera } from 'lucide-react';
import { useQRScanner } from '../../hooks/useQRScanner';

interface QRCodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function QRCodeScanner({ onScan, onClose }: QRCodeScannerProps) {
  const { startScanner, stopScanner, isScanning, error } = useQRScanner(onScan);

  useEffect(() => {
    const timer = setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Scan Offer QR Code</h3>
        
        <div className="relative aspect-square">
          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50">
              <Camera className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Initializing camera...</p>
            </div>
          )}
          
          <div id="qr-reader" className="overflow-hidden rounded-lg" />
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-50 p-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-sm text-gray-600 text-center">{error}</p>
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          className="w-full mt-4"
          onClick={() => {
            stopScanner();
            onClose();
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}