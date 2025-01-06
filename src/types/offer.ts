export interface Offer {
  id: string;
  shopId: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  active: boolean;
}