import api from './api';

export const kdsService = {
  getKDSOrders: async (params) => {
    const response = await api.get('/kds', { params });
    return response.data;
  },
  
  getKDSStats: async () => {
    const response = await api.get('/kds/stats');
    return response.data;
  },

  getKDSOrderDetails: async (id) => {
    const response = await api.get(`/kds/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/kds/${id}/status`, { status });
    return response.data;
  }
};
