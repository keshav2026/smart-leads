import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import { Lead, LeadStatus, LeadSource, CreateLeadDto } from '@/types';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
}

const statusOptions = Object.values(LeadStatus).map((v) => ({ value: v, label: v }));
const sourceOptions = Object.values(LeadSource).map((v) => ({ value: v, label: v }));

export const LeadForm = ({ isOpen, onClose, lead }: LeadFormProps) => {
  const isEditing = !!lead;
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLeadDto>({
    defaultValues: {
      name: '',
      email: '',
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      notes: '',
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes ?? '',
      });
    } else {
      reset({
        name: '',
        email: '',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        notes: '',
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data: CreateLeadDto) => {
    if (isEditing && lead) {
      await updateLead.mutateAsync({ id: lead._id, data });
    } else {
      await createLead.mutateAsync(data);
    }
    onClose();
  };

  const isPending = createLead.isPending || updateLead.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Lead' : 'Add New Lead'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
          })}
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="status"
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status', { required: 'Status is required' })}
          />
          <Select
            id="source"
            label="Source"
            options={sourceOptions}
            error={errors.source?.message}
            {...register('source', { required: 'Source is required' })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Any additional notes..."
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            {...register('notes', { maxLength: { value: 500, message: 'Max 500 characters' } })}
          />
          {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
