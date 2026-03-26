import axios from 'axios';
import { API_CONFIG } from '../config';

const profileService = {
    // Update basic profile details
    updateProfile: async (userData) => {
        if (API_CONFIG.IS_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ success: true, user: userData }), 500);
            });
        }
        
        // Changed from PUT to POST as per backend requirement
        const response = await axios.post(`${API_CONFIG.BASE_URL}/student/profile/update`, userData);
        return response.data;
    },

    // Change password
    changePassword: async (currentPassword, newPassword, user) => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/users.json');
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const mockUsers = data.default;
                    const currentUserInMock = mockUsers.find(u => u.email.toLowerCase() === user?.email?.toLowerCase());
                    
                    // Priority to locally modified password if user changed it in same session
                    const actualPassword = user?.password || currentUserInMock?.password || "password123";

                    if (currentPassword !== actualPassword) {
                        reject(new Error("Current password is incorrect"));
                    } else {
                        resolve({ success: true, message: "Password updated successfully" });
                    }
                }, 600);
            });
        }

        // Changed from PUT to POST as per backend requirement
        const response = await axios.post(`${API_CONFIG.BASE_URL}/student/profile/change-password`, { currentPassword, newPassword });
        return response.data;
    },

    // Verify current password (used for inline feedback in UI)
    verifyCurrentPassword: async (currentPassword, user) => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/users.json');
            return new Promise((resolve) => {
                 setTimeout(() => {
                     const mockUsers = data.default;
                     const currentUserInMock = mockUsers.find(u => u.email.toLowerCase() === user?.email?.toLowerCase());
                     const actualPassword = user?.password || currentUserInMock?.password || "password123";
                     
                     resolve({ isValid: currentPassword.trim() === actualPassword });
                 }, 300);
            });
        }

        const response = await axios.post(`${API_CONFIG.BASE_URL}/student/profile/verify-password`, { currentPassword });
        return response.data;
    }
};

export default profileService;
