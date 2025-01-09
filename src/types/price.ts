export interface PriceItem {
  id: string;
  name: string;
  price: number;
  duration?: number; // in minutes
  createdAt: string;
}