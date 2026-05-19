import api from './api';
import { ApiResponse, LoginResponse, User } from '@/types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<LoginResponse> => {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/register', data);
    return res.data.data!;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return res.data.data!;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data.data!;
  },
};
