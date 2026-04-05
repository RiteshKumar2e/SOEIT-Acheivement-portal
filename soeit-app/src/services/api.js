import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor → attach JWT token & handle mock data for demo mode
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;

      // Try to get token from SecureStore first (Native), then fallback to localStorage (Web)
      if (Platform.OS !== 'web') {
        token = await SecureStore.getItemAsync('soeit_token').catch(() => null);
      }

      if (!token && typeof localStorage !== 'undefined') {
        token = localStorage.getItem('soeit_token');
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // MOCK DATA LOGIC: If using demo token, intercept certain GET requests to prevent 401s
      if (token === 'demo-token-123' && config.method === 'get') {
        const url = config.url;
        if (url.includes('/achievements/my')) {
          return { ...config, adapter: () => Promise.resolve({ data: { success: true, data: [] }, status: 200, statusText: 'OK', headers: {}, config }) };
        }
        if (url.includes('/internships')) {
          return { ...config, adapter: () => Promise.resolve({ data: { success: true, data: [] }, status: 200, statusText: 'OK', headers: {}, config }) };
        }
        if (url.includes('/courses')) {
          return { ...config, adapter: () => Promise.resolve({ data: { success: true, data: [] }, status: 200, statusText: 'OK', headers: {}, config }) };
        }
      }
    } catch (e) {
      console.warn('Token retrieval error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 Unauthorized, only log out if NOT in demo mode
    if (error.response?.status === 401) {
      // Get current token to check if it's demo
      let token = null;
      if (typeof localStorage !== 'undefined') {
        token = localStorage.getItem('soeit_token');
      }
      if (!token && Platform.OS !== 'web') {
        token = await SecureStore.getItemAsync('soeit_token').catch(() => null);
      }

      // If it's a real token (not demo), then clear session and logout
      if (token && token !== 'demo-token-123') {
        if (Platform.OS === 'web') {
          localStorage.removeItem('soeit_token');
          localStorage.removeItem('soeit_user');
        } else {
          await SecureStore.deleteItemAsync('soeit_token');
          await SecureStore.deleteItemAsync('soeit_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
