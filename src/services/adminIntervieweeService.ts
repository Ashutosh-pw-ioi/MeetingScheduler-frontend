// services/intervieweeService.ts
import axios, { AxiosResponse } from 'axios';
import { ApiResponse, Interviewee } from '../types/adminInterviewees.types';

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

class IntervieweeService {
  async getAllInterviewees(): Promise<ApiResponse<Interviewee[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Interviewee[]>> = await apiClient.get('/api/admin/allInterviewees');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch interviewees:', error);
      throw error;
    }
  }
}

export const intervieweeService = new IntervieweeService();
