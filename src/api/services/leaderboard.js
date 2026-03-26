import axios from 'axios';
import { API_CONFIG } from '../config';

const leaderboardService = {
    // Get leaderboard rankings
    getLeaderboard: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/leaderboard.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 400);
            });
        }

        // --- REAL API CALL ---
        // Replace with actual endpoint when backend is ready
        const response = await axios.get(`${API_CONFIG.BASE_URL}/leaderboard`);
        return response.data;
    },
};

export default leaderboardService;
