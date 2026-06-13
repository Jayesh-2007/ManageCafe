import apiClient, { handleApiResponse } from './apiClient';

export const orderService = {
  getOrders: async (params) => {
    const response = await apiClient.get('/orders', { params });
    return handleApiResponse(response);
  },
  
  getOrder: async (id) => {
    const response = await apiClient.get(`/orders/${id}`);
    return handleApiResponse(response);
  },

  createOrder: async (payload) => {
    const response = await apiClient.post('/orders', payload);
    return handleApiResponse(response);
  },
  
  updateOrder: async (id, payload) => {
    const response = await apiClient.put(`/orders/${id}`, payload);
    return handleApiResponse(response);
  },
  
  deleteOrder: async (id) => {
    const response = await apiClient.delete(`/orders/${id}`);
    return handleApiResponse(response);
  },
  
  sendToKitchen: async (id) => {
    const response = await apiClient.post(`/orders/${id}/send-to-kitchen`);
    return handleApiResponse(response);
  },
  
  payOrder: async (id, paymentDetails) => {
    const response = await apiClient.post(`/orders/${id}/pay`, paymentDetails);
    return handleApiResponse(response);
  }
};
