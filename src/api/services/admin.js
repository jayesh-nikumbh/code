import axios from 'axios';
import { API_CONFIG } from '../config';

const adminService = {
  // Get admin dashboard status cards data
  getDashboardStats: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/admin_stats.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 600);
      });
    }

    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/dashboard-stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      throw error;
    }
  },

  // Add a new user
  addUser: async (userData) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: "User added successfully!" });
        }, 1000);
      });
    }

    try {
      const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/users/add`, userData);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error.response?.data?.message || "Failed to add user";
    }
  },

  // Get list of students for management
  getStudents: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/students_list.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 800);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/students`);
    return response.data;
  },

  // Update student status (block/unblock)
  updateStudentStatus: async (studentId, status) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/students/update-status`, { studentId, status });
    return response.data;
  },

  // Update student course
  updateStudentCourse: async (studentId, course) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/students/update-course`, { studentId, course });
    return response.data;
  },

  // Remove a student
  removeStudent: async (studentId) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/students/remove`, { studentId });
    return response.data;
  },

  // Get users for role definition
  getUsersForRoles: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/users_for_roles.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 600);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/users/roles`);
    return response.data;
  },

  // Update user role
  updateRole: async (userId, role) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/users/update-role`, { userId, role });
    return response.data;
  },

  // Get overall attendance overview chart data
  getOverallAttendance: async () => {
    if (API_CONFIG.IS_MOCK) {
      const resp = await import('../../data/admin/attendance_overview.json');
      const data = resp.default || resp; // Robustly handle JSON default export
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 700);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/attendance/overview`);
    return response.data;
  },

  // Get students with low attendance
  getLowAttendanceStudents: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/low_attendance.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 600);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/attendance/low-attendance`);
    return response.data;
  },

  // Send warning to a student
  sendAttendanceWarning: async (studentId) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/attendance/send-warning`, { studentId });
    return response.data;
  },

  // Get list of rewards for management
  getRewards: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/rewards_store.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 600);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/rewards`);
    return response.data;
  },

  // Save (Add or Update) a reward
  saveReward: async (rewardData) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, reward: rewardData }), 800);
      });
    }

    const endpoint = rewardData.id ? `/admin/rewards/update` : `/admin/rewards/add`;
    const response = await axios.post(`${API_CONFIG.BASE_URL}${endpoint}`, rewardData);
    return response.data;
  },

  // Delete a reward
  deleteReward: async (rewardId) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 800);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/rewards/remove`, { rewardId });
    return response.data;
  },

  // Get system activity logs
  getActivityLogs: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/activity_logs.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 700);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/activity-logs`);
    return response.data;
  },

  // Get calendar marked dates and activities
  getCalendarData: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/calendar_data.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 600);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/calendar/data`);
    return response.data;
  },
  
  // Declare session day or holiday
  declareCalendarEvent: async (eventData) => {
    if (API_CONFIG.IS_MOCK) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 500);
        });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/calendar/declare`, eventData);
    return response.data;
  },
  // Send system-wide announcement
  sendAnnouncement: async (message) => {
    if (API_CONFIG.IS_MOCK) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/announcements/send`, { message });
    return response.data;
  },

  // Get recent system activities
  getRecentActivities: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/recent_activity.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 600);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/recent-activities`);
    return response.data;
  },

  // Get list of assignments
  getAssignments: async () => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/assignments.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 700);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/assignments`);
    return response.data;
  },

  // Create or Update Assignment
  saveAssignment: async (assignmentData) => {
    if (API_CONFIG.IS_MOCK) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true, assignment: assignmentData }), 1000);
      });
    }

    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/assignments/save`, assignmentData);
    return response.data;
  },

  // Get submissions for a specific assignment
  getSubmissions: async (assignmentId) => {
    if (API_CONFIG.IS_MOCK) {
      const { default: data } = await import('../../data/admin/submissions_list.json');
      return new Promise((resolve) => {
        setTimeout(() => resolve(data[assignmentId] || []), 600);
      });
    }

    const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/assignments/submissions?id=${assignmentId}`);
    return response.data;
  },

  // Submit grade and feedback for a submission
  submitGrade: async (submissionId, gradeData) => {
    if (API_CONFIG.IS_MOCK) {
       return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 800);
      });
    }
    const response = await axios.post(`${API_CONFIG.BASE_URL}/admin/assignments/submissions/grade`, { 
      submissionId, 
      ...gradeData 
    });
    return response.data;
  }
};

export default adminService;
