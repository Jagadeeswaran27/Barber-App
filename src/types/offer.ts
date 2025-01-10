export interface Offer {
  id: string;
  shopId: string;
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  qrCode: string;
  code: string;
  active: boolean;
}

export interface OfferRedemption {
  id: string;
  offerId: string;
  customerId: string;
  shopId: string;
  redeemedAt: string;
}