import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('soeit_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('soeit_token');
            localStorage.removeItem('soeit_user');
            // Remove hard redirect to allow guests on public pages
        }
        return Promise.reject(error);

    }
);

// Auth APIs
export const authAPI = {
    register: (data) => API.post('/auth/register', data),
    login: (data) => API.post('/auth/login', data),
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
    getProfile: () => API.get('/auth/profile'),
    updateProfile: (data) => API.put('/auth/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    changePassword: (data) => API.put('/auth/change-password', data),
    logout: () => API.post('/auth/logout'),
};

// Achievement APIs
export const achievementAPI = {
    create: (data) => API.post('/achievements', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getMy: (params) => API.get('/achievements/my', { params }),
    getOne: (id) => API.get(`/achievements/${id}`),
    update: (id, data) => API.put(`/achievements/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => API.delete(`/achievements/${id}`),
    getStats: () => API.get('/achievements/stats'),
    getPortfolio: (userId) => API.get(`/achievements/portfolio/${userId}`),
    getPublicStudents: (params) => API.get('/achievements/public-students', { params }),

};

// Admin APIs
export const adminAPI = {
    getDashboard: () => API.get('/admin/dashboard'),
    getPending: (params) => API.get('/admin/achievements/pending', { params }),
    getAll: (params) => API.get('/admin/achievements', { params }),
    verify: (id, data) => API.put(`/admin/achievements/${id}/verify`, data),
    getStudents: (params) => API.get('/admin/students', { params }),
    getFaculty: (params) => API.get('/admin/faculty', { params }),
    getReports: () => API.get('/admin/reports'),
    manageUser: (id, data) => API.put(`/admin/users/${id}`, data),
    deleteUsers: (ids) => API.delete('/admin/users', { data: { ids } }),
};

// Event APIs
export const eventAPI = {
    create: (data) => API.post('/events', data),
    getAll: (params) => API.get('/events', { params }),
    update: (id, data) => API.put(`/events/${id}`, data),
    delete: (id) => API.delete(`/events/${id}`),
};

// Notice APIs
export const noticeAPI = {
    create: (data) => API.post('/notices', data),
    getAll: () => API.get('/notices'),
    delete: (id) => API.delete(`/notices/${id}`),
};

export const courseAPI = {
    add: (data) => API.post('/courses', data),
    getMy: () => API.get('/courses/my'),
    updateProgress: (id, data) => API.put(`/courses/${id}/progress`, data),
    delete: (id) => API.delete(`/courses/${id}`),
    getAll: (params) => API.get('/courses', { params }),
};

export const hackathonAPI = {
    logActivity: (data) => API.post('/hackathons/activity', data),
    getAllActivities: (params) => API.get('/hackathons/activity', { params }),
};

export default API;
