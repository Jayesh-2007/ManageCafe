import apiClient, { handleApiResponse } from './apiClient';

export const categoryService = {
  getAll: async () => {
    const res = await apiClient.get('/categories');
    return handleApiResponse(res);
  },
  getById: async (id) => {
    const res = await apiClient.get(`/categories/${id}`);
    return handleApiResponse(res);
  },
  create: async (data) => {
    const res = await apiClient.post('/categories', data);
    return handleApiResponse(res);
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/categories/${id}`, data);
    return handleApiResponse(res);
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/categories/${id}`);
    return handleApiResponse(res);
  }
};
