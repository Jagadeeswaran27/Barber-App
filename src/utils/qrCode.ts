import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate a high quality QR code with better options
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 400, // Larger size for better scanning
      margin: 2,
      errorCorrectionLevel: 'H', // Highest error correction
      type: 'image/png',
      quality: 0.92,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrDataUrl;
  } catch (err) {
    console.error('QR Code generation error:', err);
    throw new Error('Failed to generate QR code');
  }
}