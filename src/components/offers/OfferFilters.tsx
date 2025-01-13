import { Button } from '../Button';

type FilterStatus = 'all' | 'active' | 'inactive';

interface OfferFiltersProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: {
    active: number;
    inactive: number;
    total: number;
  };
}

export function OfferFilters({ currentFilter, onFilterChange, counts }: OfferFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={currentFilter === 'active' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('active')}
        className="text-sm"
      >
        Active ({counts.active})
      </Button>
      <Button
        variant={currentFilter === 'inactive' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('inactive')}
        className="text-sm"
      >
        Inactive ({counts.inactive})
      </Button>
      <Button
        variant={currentFilter === 'all' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('all')}
        className="text-sm"
      >
        All ({counts.total})
      </Button>
    </div>
  );
}