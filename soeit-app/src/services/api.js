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

      // Robust token retrieval for both native and web
      if (Platform.OS === 'web') {
        token = typeof localStorage !== 'undefined' ? localStorage.getItem('soeit_token') : null;
        if (!token && typeof sessionStorage !== 'undefined') {
          token = sessionStorage.getItem('soeit_token');
        }
      } else {
        token = await SecureStore.getItemAsync('soeit_token').catch(() => null);
        if (!token && typeof localStorage !== 'undefined') {
          token = localStorage.getItem('soeit_token');
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }


    } catch (e) {
      console.warn('[API] Request Error:', e);
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
    const authHeader = error.config?.headers?.Authorization || '';
    const isDemo = authHeader.includes('demo-token-');

    if (error.response?.status === 401 && !isDemo) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('soeit_token');
        localStorage.removeItem('soeit_user');
      }
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync('soeit_token').catch(() => { });
        await SecureStore.deleteItemAsync('soeit_user').catch(() => { });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
