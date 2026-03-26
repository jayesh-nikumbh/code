import axios from 'axios';
import { API_CONFIG } from '../config';

const facultyService = {
    // Get list of all faculty members
    getFacultyList: async () => {
        if (API_CONFIG.IS_MOCK) {
            const data = await import('../../data/faculty.json');
            return new Promise((resolve) => {
                setTimeout(() => resolve(data.default), 400);
            });
        }

        // --- REAL API CALL ---
        // Replace with actual endpoint when backend is ready
        const response = await axios.get(`${API_CONFIG.BASE_URL}/faculty`);
        return response.data;
    },
};

export default facultyService;
