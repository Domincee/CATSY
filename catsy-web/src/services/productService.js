import { apiClient } from './api';

export const productService = {
    // Products
    getAllProducts: () => apiClient('/products'),
    createProduct: (product) => apiClient('/products', {
        method: 'POST',
        body: JSON.stringify(product)
    }),
    updateProduct: (id, product) => apiClient(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
    }),
    deleteProduct: (id) => apiClient(`/products/${id}`, {
        method: 'DELETE'
    }),

    // Categories
    getAllCategories: () => apiClient('/categories'),
    createCategory: (category) => apiClient('/categories', {
        method: 'POST',
        body: JSON.stringify(category)
    }),
    updateCategory: (id, category) => apiClient(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category)
    }),
    deleteCategory: (id) => apiClient(`/categories/${id}`, {
        method: 'DELETE'
    })
};
