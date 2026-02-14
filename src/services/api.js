import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Something went wrong';

        // Check if it's a 401 error that should be ignored (token expiry) vs one that should be shown (wrong password)
        const isAuthError = error.response?.status === 401;
        const isActionEndpoint = error.config.url.includes('login') || error.config.url.includes('updatepassword');

        if (!isAuthError || isActionEndpoint) {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
    updateMe: (data) => api.put('/auth/me', data),
    updatePassword: (data) => api.put('/auth/updatepassword', data),
};

// Properties API
export const propertiesAPI = {
    getAll: (params) => api.get('/properties', { params }),
    getAllAdmin: (params) => api.get('/admin/properties', { params }),
    getById: (id) => api.get(`/properties/${id}`),
    getBySlug: (slug) => api.get(`/properties/slug/${slug}`),
    create: (formData) => api.post('/admin/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, formData) => api.put(`/admin/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/admin/properties/${id}`),
    toggleFeatured: (id) => api.put(`/admin/properties/${id}/featured`),
};

// Blogs API
export const blogsAPI = {
    getAll: (params) => api.get('/blogs', { params }),
    getAllAdmin: (params) => api.get('/admin/blogs', { params }),
    getById: (id) => api.get(`/blogs/${id}`),
    // getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
    create: (formData) => api.post('/admin/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, formData) => api.put(`/admin/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/admin/blogs/${id}`),
    togglePublish: (id) => api.put(`/admin/blogs/${id}/publish`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/admin/dashboard-stats')
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/admin/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/admin/categories', data),
    update: (id, data) => api.put(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
};

// Team API
export const teamAPI = {
    getAll: () => api.get('/team'),
    getAllAdmin: (params) => api.get('/admin/team/all', { params }),
    getById: (id) => api.get(`/team/${id}`),
    create: (formData) => api.post('/admin/team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, formData) => api.put(`/admin/team/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/admin/team/${id}`),
    reorder: (orders) => api.put('/admin/team/reorder', { orders }),
};

// Contacts API
export const contactsAPI = {
    create: (data) => api.post('/contact', data),
    getAll: (params) => api.get('/admin/contacts', { params }),
    getById: (id) => api.get(`/admin/contacts/${id}`),
    updateStatus: (id, status) => api.put(`/admin/contacts/${id}`, { status }),
    delete: (id) => api.delete(`/admin/contacts/${id}`),
};

// Interests API
export const interestsAPI = {
    getAll: () => api.get('/interests'),
    create: (data) => api.post('/admin/interests', data),
    delete: (id) => api.delete(`/admin/interests/${id}`),
};

// Pages API
export const pagesAPI = {
    getAll: () => api.get('/pages'),
    create: (data) => api.post('/admin/pages', data),
    update: (id, data) => api.put(`/admin/pages/${id}`, data),
    delete: (id) => api.delete(`/admin/pages/${id}`),
};

// Hero Sections API
export const heroSectionsAPI = {
    getAll: (params) => api.get('/hero-sections', { params }),
    create: (formData) => api.post('/admin/hero-sections', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    update: (id, formData) => api.put(`/admin/hero-sections/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    delete: (id) => api.delete(`/admin/hero-sections/${id}`),
};

// QnA API
export const qnaAPI = {
    getAll: () => api.get('/qnas'),
    create: (data) => api.post('/admin/qnas', data),
    update: (id, data) => api.put(`/admin/qnas/${id}`, data),
    delete: (id) => api.delete(`/admin/qnas/${id}`),
};

// Stats API
export const statsAPI = {
    getAll: () => api.get('/stats'),
    create: (data) => api.post('/admin/stats', data),
    update: (id, data) => api.put(`/admin/stats/${id}`, data),
    delete: (id) => api.delete(`/admin/stats/${id}`),
};

export default api;
