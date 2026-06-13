import api from './api';

export const orderService = {
  getOrders: async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (payload) => {
    const response = await api.post('/orders', payload);
    return response.data;
  },
  
  updateOrder: async (id, payload) => {
    const response = await api.put(`/orders/${id}`, payload);
    return response.data;
  },
  
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
  
  sendToKitchen: async (id) => {
    const response = await api.post(`/orders/${id}/send-to-kitchen`);
    return response.data;
  },
  
  payOrder: async (id, paymentDetails) => {
    const response = await api.post(`/orders/${id}/pay`, paymentDetails);
    return response.data;
  }
};
