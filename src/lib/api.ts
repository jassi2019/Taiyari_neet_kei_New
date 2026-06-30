import axios, { AxiosError } from 'axios';

import env from '@/constants/env';
import tokenManager from './tokenManager';

// Custom Axios instance with common configurations
const api = axios.create({
  baseURL: env.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};
    const token = tokenManager.getToken();

    if (token && !config.headers.Authorization) {
      const authToken = `Bearer ${token}`;
      config.headers.Authorization = authToken;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    console.log(JSON.stringify(error, null, 2));
    return Promise.reject(error?.response?.data);
  }
);

export default api;
