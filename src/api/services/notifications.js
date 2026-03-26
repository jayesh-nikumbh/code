import axios from 'axios';
import { API_CONFIG } from '../config';

const notificationsService = {
    // Get all notifications for the logged-in student
    getNotifications: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/notifications.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 400);
            });
        }

        // --- REAL API CALL ---
        // Replace with actual endpoint when backend is ready
        // Expected response: [{ id, type, title, time, isSeen }, ...]
        const response = await axios.get(`${API_CONFIG.BASE_URL}/student/notifications`);
        return response.data;
    },

    // Mark a single notification as seen (future real API)
    markAsSeen: async (notificationId) => {
        if (API_CONFIG.IS_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ success: true }), 200);
            });
        }

        // --- REAL API CALL ---
        const response = await axios.patch(`${API_CONFIG.BASE_URL}/student/notifications/${notificationId}/seen`);
        return response.data;
    },
};

export default notificationsService;
