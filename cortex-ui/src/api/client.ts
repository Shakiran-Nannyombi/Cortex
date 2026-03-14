import axios from 'axios';
import { mockApi } from './mockApi';

const API_BASE_URL = import.meta.env.PROD
  ? 'https://cortex-nboq.onrender.com/api'
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000, // 5 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh and fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is unavailable, use mock API
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.message === 'Network Error') {
      console.warn('Backend unavailable, using mock API for demo');
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Wrapper function to use fallback if needed
export const apiCall = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    const response = await api({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error) {
    // Use mock API as fallback
    console.warn(`API call failed for ${endpoint}, using mock data`);

    // Map endpoints to mock functions
    if (endpoint === '/auth/demo-login') {
      return mockApi.demoLogin();
    } else if (endpoint === '/workspaces') {
      return mockApi.getWorkspaces();
    } else if (endpoint.includes('/folders')) {
      const workspaceId = parseInt(endpoint.split('/')[2]);
      return mockApi.getFolders(workspaceId);
    } else if (endpoint === '/documents') {
      return mockApi.getDocuments();
    } else if (endpoint === '/tags') {
      return mockApi.getTags();
    } else if (endpoint === '/api-keys') {
      return mockApi.getApiKeys();
    } else if (endpoint === '/chat/message') {
      return mockApi.sendMessage(data?.message || 'Hello');
    }

    throw error;
  }
};

export default api;
