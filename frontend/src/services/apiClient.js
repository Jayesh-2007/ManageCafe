import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (!error.response) {
    console.error('Network Error / Timeout', error);
    return Promise.reject(error);
  }

  const status = error.response.status;
  
  if (status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  } else if (status === 403) {
    console.error('Permission Denied: 403 Forbidden');
  } else if (status === 404) {
    console.error('Resource Not Found: 404');
  } else if (status === 500) {
    console.error('Server Error: 500 Internal Server Error');
  }

  return Promise.reject(error);
});

export const handleApiResponse = (response) => {
  if (response.data && response.data.success !== undefined) {
    return response.data;
  }
  return { success: true, data: response.data };
};

export const handleApiError = (error) => {
  return {
    success: false,
    message: error.response?.data?.message || error.message || 'An unexpected error occurred'
  };
};

export default apiClient;
