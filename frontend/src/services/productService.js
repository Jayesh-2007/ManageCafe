import apiClient, { handleApiResponse } from './apiClient';

export const productService = {
  getAll: async (params) => {
    const res = await apiClient.get('/products', { params });
    return handleApiResponse(res);
  },
  getById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return handleApiResponse(res);
  },
  create: async (data) => {
    const res = await apiClient.post('/products', data);
    return handleApiResponse(res);
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/products/${id}`, data);
    return handleApiResponse(res);
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return handleApiResponse(res);
  }
};
