import { apiClient } from './api';

export const customerService = {
    login: (username, password) => apiClient('/customer/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        skipAuthError: true
    }),

    signup: (userData) => apiClient('/customer/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
        skipAuthError: true
    }),

    updateProfile: (customerId, data) => apiClient(`/customer/update/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            contact: data.phone,
            password: data.password // Added this field
        })
    }),

    getProfile: (customerId) => apiClient(`/customer/${customerId}`, { method: 'GET' })
};
