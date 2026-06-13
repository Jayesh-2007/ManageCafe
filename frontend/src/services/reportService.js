import apiClient, { handleApiResponse } from './apiClient';

export const reportService = {
  getSummary: async (params) => {
    const response = await apiClient.get('/reports/summary', { params });
    return handleApiResponse(response);
  },
  
  getSalesTrend: async (params) => {
    const response = await apiClient.get('/reports/sales-trend', { params });
    return handleApiResponse(response);
  },

  getTopProducts: async (params) => {
    const response = await apiClient.get('/reports/top-products', { params });
    return handleApiResponse(response);
  },

  getTopCategories: async (params) => {
    const response = await apiClient.get('/reports/top-categories', { params });
    return handleApiResponse(response);
  },

  exportReport: async (params) => {
    const response = await apiClient.get('/reports/export', { 
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
