import { apiClient } from './api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const settingsService = {
    /**
     * Fetch restaurant settings — public, no auth required.
     */
    async getSettings() {
        const res = await fetch(`${BASE_URL}/api/settings`);
        if (!res.ok) throw new Error('Failed to fetch restaurant settings');
        return res.json();
    },

    /**
     * Update restaurant settings — requires staff/admin JWT.
     */
    async updateSettings(data) {
        return apiClient('/api/admin/settings', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};
