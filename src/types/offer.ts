export interface Offer {
  id: string;
  shopId: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  qrCode: string;
  code: string;
}

export interface OfferRedemption {
  id: string;
  offerId: string;
  customerId: string;
  shopId: string;
  redeemedAt: string;
}