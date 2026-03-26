import axios from 'axios';
import { API_CONFIG } from '../config';

const attendanceService = {
    // Check if attendance session is active and if student has already marked it
    getAttendanceStatus: async () => {
        if (API_CONFIG.IS_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        hasActiveSession: true,   // true = card dikhao, false = card mat dikhao
                        isMarked: false,          // true = already marked, card mat dikhao
                        sessionName: "Web Development Lecture",  // session ka naam card par dikhega
                        allowedLocation: {
                            latitude: 18.5204,    // College/classroom ka latitude
                            longitude: 73.8567,   // College/classroom ka longitude
                            radiusMeters: 200     // Kitni door tak allowed hai (meters)
                        }
                    });
                }, 400);
            });
        }

        const response = await axios.get(`${API_CONFIG.BASE_URL}/attendance/status`);
        return response.data;
    },

    // Mark attendance for the current student
    markAttendance: async () => {
        if (API_CONFIG.IS_MOCK) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, message: "Attendance marked in mock mode" });
                }, 600);
            });
        }

        const response = await axios.post(`${API_CONFIG.BASE_URL}/attendance/mark`);
        return response.data;
    },

    // Get attendance calendar data of Dashboard of student (attended and scheduled dates)
    getCalendarData: async (month, year) => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/attendance_calendar.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 500);
            });
        }

        const response = await axios.get(`${API_CONFIG.BASE_URL}/attendance/calendar`, {
            params: { month, year }
        });
        return response.data;
    },

    // Get attendance history records of Dashboard of student
    getAttendanceHistory: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/attendance_history.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 500);
            });
        }

        const response = await axios.get(`${API_CONFIG.BASE_URL}/attendance/history`);
        return response.data;
    },

    // Get attendance trend data of Dashboard of student
    getAttendanceTrend: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/attendance_trend.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 500);
            });
        }

        const response = await axios.get(`${API_CONFIG.BASE_URL}/attendance/trend`);
        return response.data;
    },

    // Get attendance records for admin (all students attendance)
    getAdminAttendanceRecords: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/admin/attendance_records.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 600);
            });
        }

        const response = await axios.get(`${API_CONFIG.BASE_URL}/admin/attendance/records`);
        return response.data;
    }
};

export default attendanceService;
