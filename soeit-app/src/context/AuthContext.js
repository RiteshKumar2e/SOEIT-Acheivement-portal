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
    const demoUser = {
      id: 'demo-id',
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `${role}@demo.com`,
      role: role,
    };
    const demoToken = 'demo-token-123';
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

  const isStudent = user?.role === 'student';
  const isFaculty = user?.role === 'faculty';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, loginDemo, register, logout, refreshUser,
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
