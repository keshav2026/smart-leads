import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import { useLeads } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { Lead, LeadFilters } from '@/types';

const defaultFilters: LeadFilters = {
  page: 1,
  limit: 10,
  status: '',
  source: '',
  search: '',
  sort: 'latest',
};

const LeadsPage = () => {
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [searchInput, setSearchInput] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const debouncedSearch = useDebounce(searchInput, 400);
  const activeFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, isError } = useLeads(activeFilters);

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLead(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data?.meta?.total ?? 0} total leads
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 p-4 text-sm text-red-700 dark:text-red-400">
          Failed to load leads. Please try refreshing the page.
        </div>
      )}

      {/* Table */}
      <LeadTable
        leads={data?.data ?? []}
        meta={data?.meta}
        isLoading={isLoading}
        onEdit={handleEdit}
        onView={setViewingLead}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />

      {/* Modals */}
      <LeadForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        lead={editingLead}
      />

      <LeadDetailModal
        lead={viewingLead}
        onClose={() => setViewingLead(null)}
      />
    </div>
  );
};

export default LeadsPage;
