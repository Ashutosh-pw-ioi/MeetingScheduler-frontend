import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  withCredentials: true, // Important for session cookies
  timeout: 10000, // Add timeout to prevent hanging requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 errors from login page - let components handle it
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      window.location.href = '/auth/login/interviewer';
    }
    return Promise.reject(error);
  }
);
