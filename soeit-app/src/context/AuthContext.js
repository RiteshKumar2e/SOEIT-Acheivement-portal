import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext(null);

// Storage abstraction layer for web and native
const StorageManager = {
  async getItem(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      // Fallback to localStorage for web
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      throw e;
    }
  },
  async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      // Fallback to localStorage for web
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      } else {
        throw e;
      }
    }
  },
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      // Fallback to localStorage for web
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      } else {
        throw e;
      }
    }
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved session
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await StorageManager.getItem('soeit_token');
        const savedUser = await StorageManager.getItem('soeit_user');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Session load error:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    await StorageManager.setItem('soeit_token', newToken);
    await StorageManager.setItem('soeit_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  }, []);

  const loginDemo = useCallback(async (role = 'student') => {
    // Generate realistic demo users based on role
    let demoUser = {
      id: `demo-${role}-123`,
      email: `${role.toLowerCase()}@demo.arkajainuniversity.ac.in`,
      role: role,
      isDemo: true,
    };

    if (role === 'student') {
      demoUser = {
        ...demoUser,
        name: 'Ritesh Kumar',
        email: 'student@demo.arkajainuniversity.ac.in',
        role: 'student',
        enrollmentNo: 'AJU/221403',
        department: 'B.Tech (CSE)',
        semester: 6,
        section: 'A',
        batch: '2022',
      };
    } else if (role === 'faculty') {
      demoUser = {
        ...demoUser,
        name: 'Dr. Priya Sharma',
        email: 'faculty@demo.arkajainuniversity.ac.in',
        role: 'faculty',
        employeeId: 'FAC/001',
        department: 'Computer Science',
      };
    } else if (role === 'admin') {
      demoUser = {
        ...demoUser,
        name: 'Rajesh Singh',
        email: 'admin@demo.arkajainuniversity.ac.in',
        role: 'admin',
        employeeId: 'ADMIN/001',
        department: 'Administration',
      };
    }

    const demoToken = `demo-token-${role}-${Date.now()}`;
    await StorageManager.setItem('soeit_token', demoToken);
    await StorageManager.setItem('soeit_user', JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
    return demoUser;
  }, []);

  const register = useCallback(async (formData) => {
    const res = await api.post('/auth/register', formData);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout'); } catch (_) {}
    await StorageManager.removeItem('soeit_token');
    await StorageManager.removeItem('soeit_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      const updated = res.data.user;
      setUser(updated);
      await StorageManager.setItem('soeit_user', JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Refresh user error:', e);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      const updated = res.data.user;
      setUser(updated);
      await StorageManager.setItem('soeit_user', JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Update profile error:', e);
      throw e;
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    try {
      const res = await api.put('/auth/change-password', passwordData);
      return res.data;
    } catch (e) {
      console.error('Change password error:', e);
      throw e;
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    StorageManager.setItem('soeit_user', JSON.stringify(updatedUser));
  }, []);

  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, loginDemo, register, logout, refreshUser, updateProfile, changePassword, updateUser,
      isStudent, isFaculty, isAdmin,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
