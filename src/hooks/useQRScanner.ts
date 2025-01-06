import { useState, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera } from '@capacitor/camera';
import { isNative } from '../utils/platform';

interface QRScannerConfig {
  fps?: number;
  qrboxSize?: number;
}

export function useQRScanner(
  onResult: (text: string) => void,
  config: QRScannerConfig = {}
) {
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const {
    fps = 10,
    qrboxSize = 250
  } = config;

  const requestCameraPermission = async () => {
    if (!isNative()) return true;
    
    const permission = await Camera.checkPermissions();
    if (permission.camera !== 'granted') {
      const request = await Camera.requestPermissions();
      return request.camera === 'granted';
    }
    return true;
  };

  const startScanner = useCallback(async () => {
    try {
      setError('');

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps,
          qrbox: { width: qrboxSize, height: qrboxSize }
        },
        (decodedText) => {
          stopScanner();
          onResult(decodedText);
        },
        (errorMessage) => {
          console.debug('QR Scanning:', errorMessage);
        }
      );

      setIsScanning(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera access failed';
      setError(
        message.includes('NotAllowedError')
          ? 'Camera access denied. Please grant camera permissions.'
          : 'Could not start camera. Please try again.'
      );
      console.error('Scanner error:', err);
    }
  }, [onResult, fps, qrboxSize]);

  const stopScanner = useCallback(() => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().catch(console.error);
      setIsScanning(false);
    }
  }, []);

  return {
    startScanner,
    stopScanner,
    isScanning,
    error,
  };
}