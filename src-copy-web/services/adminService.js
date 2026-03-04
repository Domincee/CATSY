import { apiClient } from './api';

export const adminService = {
    login: async (email, password) => {
        return apiClient('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            skipAuthError: true
        });
    },

    getUsers: () => apiClient('/admin/users', { method: 'GET' }),

    createUser: (userData) => apiClient('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    changePassword: (userId, password) => apiClient(`/admin/users/${userId}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ password })
    }),

    deleteUser: (userId) => apiClient(`/admin/users/${userId}`, { method: 'DELETE' }),

    getProducts: () => apiClient('/admin/products', { method: 'GET' }),

    createProduct: (productData) => apiClient('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    }),

    updateProduct: (productId, productData) => apiClient(`/admin/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    }),

    deleteProduct: (productId) => apiClient(`/admin/products/${productId}`, { method: 'DELETE' }),

    getCategories: () => apiClient('/admin/categories', { method: 'GET' }),

    createCategory: (categoryData) => apiClient('/admin/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
    }),

    updateCategory: (categoryId, categoryData) => apiClient(`/admin/categories/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    }),

    deleteCategory: (categoryId) => apiClient(`/admin/categories/${categoryId}`, { method: 'DELETE' }),

    // Reservations
    getReservations: () => apiClient('/api/staff/reservations', { method: 'GET' }),

    updateReservationStatus: (reservationId, status) => apiClient(`/api/staff/reservations/${reservationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    })
};
