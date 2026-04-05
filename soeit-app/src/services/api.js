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

      // MOCK DATA LOGIC: If using demo token, intercept certain GET requests to prevent 401s
      const isDemoToken = token && typeof token === 'string' && token.startsWith('demo-token-');
      
      if (isDemoToken && config.method === 'get') {
        const url = config.url || '';
        // console.log(`[API] Intercepting Demo Request: ${url}`);

        // Helper to wrap data in standard response format
        const mockRes = (data) => ({
          data: { success: true, data: data, notices: data, courses: data, internships: data, stats: data },
          status: 200, statusText: 'OK', headers: {}, config
        });

        // 🟢 ADMIN / FACULTY ENDPOINTS (Intercept by substring to be safe)
        if (url.includes('/admin/dashboard') || url.includes('/admin/stats')) {
          const stats = { totalStudents: 120, totalFaculties: 15, totalAchievements: 450, pendingCount: 25, approvedCount: 400, rejectedCount: 25 };
          return { ...config, adapter: () => Promise.resolve(mockRes(stats)) };
        }
        
        if (url.includes('/admin/students')) {
          const demoStudents = [
            { id: '1', name: 'Ritesh Kumar', email: 'ritesh@demo.edu', enrollmentNo: 'AJU/221403', semester: 6, section: 'A', achievementCounts: { approved: 5, pending: 2, points: 150 } },
            { id: '2', name: 'Anjali Sharma', email: 'anjali@demo.edu', enrollmentNo: 'AJU/221501', semester: 4, section: 'B', achievementCounts: { approved: 3, pending: 0, points: 90 } },
            { id: '3', name: 'Sumit Gupta', email: 'sumit@demo.edu', enrollmentNo: 'AJU/221605', semester: 6, section: 'A', achievementCounts: { approved: 8, pending: 1, points: 240 } },
          ];
          return { ...config, adapter: () => Promise.resolve({ data: { success: true, data: demoStudents, total: 3 }, status: 200, statusText: 'OK', headers: {}, config }) };
        }
        
        if (url.includes('/admin/achievements') || url.includes('/achievements/pending')) {
          const demoPending = [
            { id: 'ach1', title: 'Google Hash Code Finalist', category: 'Coding', level: 'International', date: '2026-03-15', status: 'pending', user: { name: 'Ritesh Kumar', enrollmentNo: 'AJU/221403' } },
            { id: 'ach2', title: 'Inter-University Cricket Winner', category: 'Sports', level: 'Regional', date: '2026-02-10', status: 'pending', user: { name: 'Anjali Sharma' } },
          ];
          return { ...config, adapter: () => Promise.resolve({ data: { success: true, data: demoPending, total: 2 }, status: 200, statusText: 'OK', headers: {}, config }) };
        }

        // 🔵 STUDENT ENDPOINTS
        if (url.includes('/achievements/my')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/internships')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/courses')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/projects')) {
          return { ...config, adapter: () => Promise.resolve(mockRes([])) };
        }
        if (url.includes('/notices')) {
          const demoNotices = [
            { id: 1, title: 'Code AJU 2026 Hackathon', content: 'Regional teams apply now!', type: 'Event', createdAt: new Date().toISOString(), priority: 'high' },
            { id: 2, title: 'Exam Guidelines 2026', content: 'Check portal for details.', type: 'Notice', createdAt: new Date().toISOString(), priority: 'normal' }
          ];
          return { ...config, adapter: () => Promise.resolve(mockRes(demoNotices)) };
        }

        if (url.includes('/notifications')) {
          const demoNotifications = [
            { _id: '1', title: 'Welcome to SOEIT', message: 'Explore your new dashboard!', type: 'system', isRead: false, createdAt: new Date().toISOString() },
            { _id: '2', title: 'Achievement Approved', message: 'Your Google Hash Code entry is live.', type: 'achievement', isRead: true, createdAt: new Date().toISOString() }
          ];
          return { ...config, adapter: () => Promise.resolve(mockRes(demoNotifications)) };
        }
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
        await SecureStore.deleteItemAsync('soeit_token').catch(() => {});
        await SecureStore.deleteItemAsync('soeit_user').catch(() => {});
      }
    }
    return Promise.reject(error);
  }
);

export default api;
