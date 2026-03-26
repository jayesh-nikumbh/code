import axios from 'axios';
import { API_CONFIG } from '../config';

const rewardsService = {
  // Get student's reward statistics (points, rank, badges)
  getRewardStats: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/rewards_stats.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 400);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/rewards/stats`);
    return response.data;
  },

  // Get student's achievements and badges
  getAchievements: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/rewards_achievements.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 500);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/rewards/achievements`);
    return response.data;
  },

  // Get available items in the reward store
  getStoreItems: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/reward_store_items.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 500);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/rewards/store`);
    return response.data;
  },

  // Redeem a reward from the store
  redeemReward: async (itemId, points) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/student/rewards/redeem`, { itemId, points });
    return response.data;
  }
};

export default rewardsService;
