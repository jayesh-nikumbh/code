import axios from 'axios';
import { API_CONFIG } from '../config';

const performanceService = {
    // Get student's monthly performance scores
    getPerformanceData: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/performance.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 400);
            });
        }

        // --- REAL API CALL ---
        // Replace with actual endpoint when backend is ready
        // Expected response: [{ month: "Sep", score: 75 }, ...]
        const response = await axios.get(`${API_CONFIG.BASE_URL}/student/performance`);
        return response.data;
    },
};

export default performanceService;
