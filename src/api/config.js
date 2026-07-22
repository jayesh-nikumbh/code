// This file holds the configuration for the API
// When the real API is ready, change IS_MOCK to false and update BASE_URL

export const API_CONFIG = {
  // Fetch from .env, fallback to IP in case .env is missing
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://13.204.165.35:5081/api', 
  IS_MOCK: true // Set to false to use the real backend API from infra team
};
