// Utility functions for offer validation
export function validateOfferCode(scannedCode: string, expectedCode: string): boolean {
  return scannedCode.trim().toUpperCase() === expectedCode.trim().toUpperCase();
}

export function validateOfferTiming(startDate: string, endDate: string): boolean {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return now >= start && now <= end;
}

export function getOfferValidationError(scannedCode: string, offer: { code: string; startDate: string; endDate: string }): string | null {
  if (!scannedCode.trim()) {
    return 'Please enter a valid offer code';
  }
  
  if (!validateOfferCode(scannedCode, offer.code)) {
    return 'Invalid offer code. Please check and try again';
  }
  
  if (!validateOfferTiming(offer.startDate, offer.endDate)) {
    const now = new Date().getTime();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();
    
    if (now < start) {
      return 'This offer is not active yet';
    }
    if (now > end) {
      return 'This offer has expired';
    }
  }
  
  return null;
}