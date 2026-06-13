import axios from 'axios';

let jwt = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  jwt = token || null;
}

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }

  return config;
});

export default api;
