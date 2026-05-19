// ─── Enums ─────────────────────────────────────────────────────────────────

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

// ─── User ─────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Lead ─────────────────────────────────────────────────────────────────

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: { name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

// ─── Filters ──────────────────────────────────────────────────────────────

export interface LeadFilters {
  page: number;
  limit: number;
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search: string;
  sort: 'latest' | 'oldest';
}

// ─── API ──────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface LoginResponse {
  token: string;
  user: User;
}
