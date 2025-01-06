// Utility functions for offer validation
export function validateOfferCode(scannedCode: string, expectedCode: string): boolean {
  return scannedCode === expectedCode;
}

export function validateOfferTiming(startDate: string, endDate: string): boolean {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return now >= start && now <= end;
}

export function getOfferValidationError(scannedCode: string, offer: { code: string; startDate: string; endDate: string }): string | null {
  if (!validateOfferCode(scannedCode, offer.code)) {
    return 'Invalid QR code for this offer';
  }
  
  if (!validateOfferTiming(offer.startDate, offer.endDate)) {
    return 'This offer has expired';
  }
  
  return null;
}