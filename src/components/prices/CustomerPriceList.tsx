import type { PriceItem } from '../../types/price';

interface CustomerPriceListProps {
  prices: PriceItem[];
}

export function CustomerPriceList({ prices }: CustomerPriceListProps) {
  return (
    <div className="grid gap-4">
      {prices.map(price => (
        <div
          key={price.id}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900">{price.name}</h3>
            <div className="flex items-baseline gap-1 flex-shrink-0">
              <span className="text-lg font-bold text-amber-600">₹{price.price}</span>
            </div>
          </div>
        </div>
      ))}

      {prices.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No services available
        </div>
      )}
    </div>
  );
}