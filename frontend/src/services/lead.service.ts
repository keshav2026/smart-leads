import api from './api';
import { ApiResponse, Lead, CreateLeadDto, UpdateLeadDto, LeadFilters } from '@/types';

export const leadService = {
  getLeads: async (filters: Partial<LeadFilters>): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.set(key, String(val));
    });
    const res = await api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const res = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data.data!;
  },

  createLead: async (data: CreateLeadDto): Promise<Lead> => {
    const res = await api.post<ApiResponse<Lead>>('/leads', data);
    return res.data.data!;
  },

  updateLead: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    const res = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data.data!;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportCSV: async (filters: Partial<LeadFilters>): Promise<Blob> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.set(key, String(val));
    });
    const res = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });
    return res.data as Blob;
  },
};
