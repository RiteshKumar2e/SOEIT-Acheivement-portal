import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://soeit-acheivement-portal.onrender.com';
export const API_BASE_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
export const STATIC_BASE_URL = API_URL.endsWith('/api') ? API_URL.replace(/\/api$/, '') : API_URL;

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('soeit_token');
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
            sessionStorage.removeItem('soeit_token');
            sessionStorage.removeItem('soeit_user');
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
    syncProgress: (id, credentials) => API.post(`/courses/${id}/sync`, credentials),
    delete: (id) => API.delete(`/courses/${id}`),
    getAll: (params) => API.get('/courses', { params }),
    // New Assignment APIs
    assign: (data) => API.post('/courses/assignments', data),
    getAssignments: (params) => API.get('/courses/assignments', { params }),
    getMyAssignments: () => API.get('/courses/assignments/my'),
    deleteAssignment: (id) => API.delete(`/courses/assignments/${id}`),
};

export const hackathonAPI = {
    getAll: (params) => API.get('/hackathons', { params }),
    create: (data) => API.post('/hackathons', data),
    delete: (id) => API.delete(`/hackathons/${id}`),
    logActivity: (data) => API.post('/hackathons/activity', data),
    getApplied: (params) => API.get('/hackathons/applied', { params }),
    deleteActivity: (id) => API.delete(`/hackathons/activity/${id}`),
};

export const internshipAPI = {
    add: (data) => API.post('/internships', data),
    getMy: () => API.get('/internships/my'),
    update: (id, data) => API.put(`/internships/${id}`, data),
    delete: (id) => API.delete(`/internships/${id}`),
    getAll: (params) => API.get('/internships', { params }),
};

export const internshipPostingAPI = {
    create: (data) => API.post('/internship-postings', data),
    getAll: (params) => API.get('/internship-postings', { params }),
    update: (id, data) => API.put(`/internship-postings/${id}`, data),
    delete: (id) => API.delete(`/internship-postings/${id}`),
};

export const projectAPI = {
    add: (data) => API.post('/projects', data),
    getMy: () => API.get('/projects/my'),
    getAll: (params) => API.get('/projects', { params }),
    delete: (id) => API.delete(`/projects/${id}`),
};

export const notificationAPI = {
    getAll: () => API.get('/notifications'),
    markAsRead: (id) => API.put(`/notifications/${id}/read`),
    markAllAsRead: () => API.put('/notifications/read-all'),
};

export default API;
