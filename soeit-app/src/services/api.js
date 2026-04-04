import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_BASE_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor → attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      if (Platform.OS === 'web') {
        token = localStorage.getItem('soeit_token');
      } else {
        token = await SecureStore.getItemAsync('soeit_token');
      }
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.warn('SecureStore error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (Platform.OS === 'web') {
        localStorage.removeItem('soeit_token');
        localStorage.removeItem('soeit_user');
      } else {
        await SecureStore.deleteItemAsync('soeit_token');
        await SecureStore.deleteItemAsync('soeit_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
