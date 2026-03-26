import axios from 'axios';
import { API_CONFIG } from '../config';

const submissionsService = {
  // Get submission history for the student
  getSubmissionHistory: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/submissions_history.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 500);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/submissions`);
    return response.data;
  },

  // Get pending assignments for the dashboard
  getPendingAssignments: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/pending_assignments.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 400);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/pending-assignments`);
    return response.data;
  },

  // Submit an assignment (file and/or URL)
  submitAssignment: async (assignmentId, data) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, message: "Assignment submitted in mock mode" }), 800);
      });
    }

    // data = FormData if file present, else JSON
    const response = await axios.post(`${API_CONFIG.BASE_URL}/student/submit-assignment/${assignmentId}`, data);
    return response.data;
  },

  // Get submission statistics
  getSubmissionStats: async () => {
    if (API_CONFIG.IS_MOCK) {
      const data = await import('../../data/submissions_stats.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data.default), 400);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/student/submissions/stats`);
    return response.data;
  }
};

export default submissionsService;
