import axios from 'axios';
import { API_CONFIG } from '../config';

const dashboardService = {
  // Get main dashboard statistics
  getStats: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/dashboard_stats.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 400);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/dashboard-stats`);
    return response.data;
  }
};

export default dashboardService;
