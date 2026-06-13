import apiClient, { handleApiResponse } from './apiClient';

export const promotionService = {
  getAll: async () => {
    const res = await apiClient.get('/promotions');
    return handleApiResponse(res);
  },
  getById: async (id) => {
    const res = await apiClient.get(`/promotions/${id}`);
    return handleApiResponse(res);
  },
  create: async (data) => {
    const res = await apiClient.post('/promotions', data);
    return handleApiResponse(res);
  },
  update: async (id, data) => {
    const res = await apiClient.put(`/promotions/${id}`, data);
    return handleApiResponse(res);
  },
  delete: async (id) => {
    const res = await apiClient.delete(`/promotions/${id}`);
    return handleApiResponse(res);
  },
  validate: async (code) => {
    const res = await apiClient.post('/promotions/validate', { code });
    return handleApiResponse(res);
  }
};
