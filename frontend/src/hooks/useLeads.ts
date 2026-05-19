import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/lead.service';
import { CreateLeadDto, LeadFilters, UpdateLeadDto } from '@/types';
import toast from 'react-hot-toast';

export const useLeads = (filters: Partial<LeadFilters>) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadService.getLeads(filters),
    staleTime: 30_000,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadService.getLeadById(id),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadDto) => leadService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully');
    },
    onError: () => toast.error('Failed to create lead'),
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) =>
      leadService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully');
    },
    onError: () => toast.error('Failed to update lead'),
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted');
    },
    onError: () => toast.error('Failed to delete lead'),
  });
};

export const useExportCSV = () => {
  return useMutation({
    mutationFn: (filters: Partial<LeadFilters>) => leadService.exportCSV(filters),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    },
    onError: () => toast.error('Failed to export CSV'),
  });
};
