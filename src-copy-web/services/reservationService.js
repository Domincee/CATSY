import { apiClient } from './api';

export const reservationService = {
    /**
     * Create a new reservation.
     * Accessible by both guests and authenticated customers.
     * @param {Object} reservationData - The reservation details
     */
    createReservation: async (reservationData) => {
        return apiClient('/api/customer/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    },

    /**
     * Fetch all reservations for the currently authenticated customer.
     */
    getMyReservations: async () => {
        return apiClient('/api/customer/reservations', {
            method: 'GET'
        });
    },

    /**
     * Fetch all reservations system-wide (Staff/Admin only).
     */
    getAllReservations: async () => {
        return apiClient('/api/staff/reservations', {
            method: 'GET'
        });
    },

    /**
     * Update the status of a specific reservation (Staff/Admin only).
     * @param {string} id - Reservation ID
     * @param {string} status - New status ('pending', 'confirmed', 'cancelled', 'completed')
     */
    updateReservationStatus: async (id, status) => {
        return apiClient(`/api/staff/reservations/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
};
