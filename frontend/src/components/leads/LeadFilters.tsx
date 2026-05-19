import { Search, SlidersHorizontal, Download } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadFilters as Filters, LeadStatus, LeadSource } from '@/types';
import { useExportCSV } from '@/hooks/useLeads';

interface LeadFiltersProps {
  filters: Filters;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.values(LeadStatus).map((v) => ({ value: v, label: v })),
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...Object.values(LeadSource).map((v) => ({ value: v, label: v })),
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
];

export const LeadFiltersBar = ({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
}: LeadFiltersProps) => {
  const exportCSV = useExportCSV();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="h-4 w-4 text-gray-400 hidden sm:block" />

        <Select
          options={statusOptions}
          value={filters.status ?? ''}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-36"
        />

        <Select
          options={sourceOptions}
          value={filters.source ?? ''}
          onChange={(e) => onFilterChange('source', e.target.value)}
          className="w-36"
        />

        <Select
          options={sortOptions}
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-36"
        />

        <Button
          variant="secondary"
          size="md"
          isLoading={exportCSV.isPending}
          onClick={() => exportCSV.mutate(filters)}
          className="gap-1.5"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};
