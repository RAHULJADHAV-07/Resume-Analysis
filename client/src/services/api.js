import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ai-resume-analyzer-api.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes timeout for AI processing on Render free tier
});

// Resume analysis services
export const resumeService = {
  // Analyze resume from file upload
  analyzeFromFile: async (formData) => {
    const response = await apiClient.post('/resumes/analyze/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Analyze resume from text input
  analyzeFromText: async (data) => {
    const response = await apiClient.post('/resumes/analyze/text', data);
    return response.data;
  },

  // Get all resume analyses
  getAll: async (params = {}) => {
    const response = await apiClient.get('/resumes', { params });
    return response.data;
  },

  // Get resume analysis by ID
  getById: async (id) => {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data;
  },

  // Delete resume analysis
  delete: async (id) => {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async (email) => {
    const response = await apiClient.get(`/resumes/stats/${email}`);
    return response.data;
  },
};

export default apiClient;
