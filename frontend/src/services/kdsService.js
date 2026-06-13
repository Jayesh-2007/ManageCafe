import apiClient, { handleApiResponse } from './apiClient';

export const kdsService = {
  getKDSOrders: async (params) => {
    const response = await apiClient.get('/kds', { params });
    return handleApiResponse(response);
  },
  
  getKDSStats: async () => {
    const response = await apiClient.get('/kds/stats');
    return handleApiResponse(response);
  },

  getKDSOrderDetails: async (id) => {
    const response = await apiClient.get(`/kds/${id}`);
    return handleApiResponse(response);
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.put(`/kds/${id}/status`, { status });
    return handleApiResponse(response);
  },

  updateKDSOrder: async (id, payload) => {
    const response = await apiClient.put(`/kds/${id}`, payload);
    return handleApiResponse(response);
  },

  completeKDSItem: async (orderId, itemId) => {
    const response = await apiClient.put(`/kds/${orderId}/items/${itemId}/complete`);
    return handleApiResponse(response);
  }
};
