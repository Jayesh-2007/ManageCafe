import apiClient, { handleApiResponse } from './apiClient';

export const customerService = {
  getAll: async (params) => {
    const res = await apiClient.get('/customers', { params });
    return handleApiResponse(res);
  },
  getById: async (id) => {
    const res = await apiClient.get(`/customers/${id}`);
    return handleApiResponse(res);
  },
  create: async (data) => {
    const res = await apiClient.post('/customers', data);
    return handleApiResponse(res);
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/customers/${id}`, data);
    return handleApiResponse(res);
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/customers/${id}`);
    return handleApiResponse(res);
  }
};
