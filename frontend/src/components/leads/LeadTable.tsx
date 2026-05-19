import { useState } from 'react';
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lead, PaginationMeta, UserRole } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useDeleteLead } from '@/hooks/useLeads';

interface LeadTableProps {
  leads: Lead[];
  meta?: PaginationMeta;
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onPageChange: (page: number) => void;
}

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

export const LeadTable = ({
  leads,
  meta,
  isLoading,
  onEdit,
  onView,
  onPageChange,
}: LeadTableProps) => {
  const { user } = useAuthStore();
  const deleteLead = useDeleteLead();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    setDeletingId(id);
    await deleteLead.mutateAsync(id);
    setDeletingId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium">No leads found</p>
                    <p className="text-xs">Try adjusting your filters or add a new lead.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lead.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge type="status" value={lead.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge type="source" value={lead.source} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onView(lead)}
                        className="rounded-lg p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(lead)}
                        className="rounded-lg p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(lead._id)}
                          disabled={deletingId === lead._id}
                          className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>
            Showing{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
            </span>{' '}
            of <span className="font-medium text-gray-900 dark:text-white">{meta.total}</span> leads
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              size="sm"
              disabled={!meta.hasPrevPage}
              onClick={() => onPageChange(meta.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[...Array(meta.totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={meta.page === i + 1 ? 'primary' : 'secondary'}
                onClick={() => onPageChange(i + 1)}
                className="min-w-[2rem]"
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              disabled={!meta.hasNextPage}
              onClick={() => onPageChange(meta.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
