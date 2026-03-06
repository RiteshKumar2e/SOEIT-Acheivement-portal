import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('soeit_user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('soeit_token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const { data } = await authAPI.getProfile();
            setUser(data.user);
        } catch {
            localStorage.removeItem('soeit_token');
            localStorage.removeItem('soeit_user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    const login = async (credentials) => {
        setError(null);
        const { data } = await authAPI.login(credentials);
        localStorage.setItem('soeit_token', data.token);
        localStorage.setItem('soeit_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        setError(null);
        const { data } = await authAPI.register(userData);
        localStorage.setItem('soeit_token', data.token);
        localStorage.setItem('soeit_user', JSON.stringify(data.user));
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try { await authAPI.logout(); } catch { }
        localStorage.removeItem('soeit_token');
        localStorage.removeItem('soeit_user');
        setUser(null);
        window.location.href = '/';
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('soeit_user', JSON.stringify(updatedUser));
    };

    const isAdmin = user?.role === 'admin';
    const isFaculty = user?.role === 'faculty';
    const isStudent = user?.role === 'student';
    const isStaff = isAdmin || isFaculty;

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateUser, isAdmin, isFaculty, isStudent, isStaff, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
