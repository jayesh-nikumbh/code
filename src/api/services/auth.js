import axios from 'axios';
import { API_CONFIG } from '../config';

/**
 * Auth API Service
 */
const authService = {
  login: async (email, password) => {
    // --- MOCK LOGIN LOGIC ---
    if (API_CONFIG.IS_MOCK) {
        const { default: mockUsers } = await import('../../data/users.json');
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          if (user.status === "blocked") {
            throw new Error("You have been blocked from the portal. Please contact the administrator.");
          }
          return {
            token: "fake-jwt-token-for-testing",
            user: { name: user.name, email: user.email, role: user.role }
          };
        } else {
          throw new Error("Invalid email or password.");
        }
    }

    // --- REAL API CALL ---
    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed.";
    }
  },

  forgotPassword: async (username) => {
    // --- MOCK FORGOT PASSWORD LOGIC ---
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: "Reset link sent to registered email." });
        }, 1000);
      });
    }

    // --- REAL API CALL ---
    // In future, implement call like: 
    // const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/forgot-password`, { username });
    // return response.data;
    return { success: true };
  },
};

export default authService;
