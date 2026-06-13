import api from './api';

export const reportService = {
  getSummary: async (params) => {
    const response = await api.get('/reports/summary', { params });
    return response.data;
  },
  
  getSalesTrend: async (params) => {
    const response = await api.get('/reports/sales-trend', { params });
    return response.data;
  },

  getTopProducts: async (params) => {
    const response = await api.get('/reports/top-products', { params });
    return response.data;
  },

  getTopCategories: async (params) => {
    const response = await api.get('/reports/top-categories', { params });
    return response.data;
  },

  exportReport: async (params) => {
    const response = await api.get('/reports/export', { 
      params,
      responseType: 'blob' 
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  }
};
