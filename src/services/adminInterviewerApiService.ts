// services/interviewerService.ts
import axios, { AxiosResponse } from 'axios';
import { ApiResponse, Interviewer } from '../types/adminInterviewer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

class InterviewerService {
  async getAllInterviewers(): Promise<ApiResponse<Interviewer[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Interviewer[]>> = await apiClient.get('/api/admin/allInterviewers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch interviewers:', error);
      throw error;
    }
  }
}

export const interviewerService = new InterviewerService();
