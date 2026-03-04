/**
 * materialsService.js — Service Layer (ISP/SRP)
 * Handles all API calls for raw_materials_inventory and product_recipe.
 * Follows the same pattern as adminService.js.
 */
import { apiClient } from './api';

export const materialsService = {
    // --- Raw Materials CRUD ---
    getAll: () => apiClient('/admin/materials', { method: 'GET' }),

    create: (data) => apiClient('/admin/materials', {
        method: 'POST',
        body: JSON.stringify(data),
    }),

    update: (id, data) => apiClient(`/admin/materials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),

    delete: (id) => apiClient(`/admin/materials/${id}`, { method: 'DELETE' }),

    /** Unit-change guard: returns { in_use: boolean } */
    checkInUse: (id) => apiClient(`/admin/materials/${id}/in-use`, { method: 'GET' }),

    // --- Product Recipes ---
    getRecipe: (productId) => apiClient(`/admin/products/${productId}/recipe`, { method: 'GET' }),

    upsertRecipe: (productId, ingredients) => apiClient(`/admin/products/${productId}/recipe`, {
        method: 'PUT',
        body: JSON.stringify({ ingredients }),
    }),
};
