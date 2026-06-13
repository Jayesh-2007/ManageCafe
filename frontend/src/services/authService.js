import apiClient, { handleApiResponse } from './apiClient';

export const authService = {
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    return handleApiResponse(res);
  },
  register: async (data) => {
    const res = await apiClient.post('/auth/register', data);
    return handleApiResponse(res);
  },
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return handleApiResponse(res);
  }
};
