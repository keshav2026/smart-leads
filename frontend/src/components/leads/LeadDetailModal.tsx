import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Lead } from '@/types';
import { Mail, Calendar, FileText, User } from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
}

export const LeadDetailModal = ({ lead, onClose }: LeadDetailModalProps) => {
  if (!lead) return null;

  const createdBy =
    typeof lead.createdBy === 'object' ? lead.createdBy.name : lead.createdBy;

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <span className="text-blue-600 dark:text-blue-300 text-xl font-bold">
              {lead.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Badge type="status" value={lead.status} />
          <Badge type="source" value={lead.source} />
        </div>

        {/* Details */}
        <div className="space-y-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
          <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={lead.email} />
          <DetailRow
            icon={<Calendar className="h-4 w-4" />}
            label="Created"
            value={new Date(lead.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          />
          <DetailRow
            icon={<User className="h-4 w-4" />}
            label="Created By"
            value={createdBy}
          />
          {lead.notes && (
            <DetailRow
              icon={<FileText className="h-4 w-4" />}
              label="Notes"
              value={lead.notes}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3">
    <span className="mt-0.5 text-gray-400">{icon}</span>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-gray-900 dark:text-white mt-0.5">{value}</p>
    </div>
  </div>
);
