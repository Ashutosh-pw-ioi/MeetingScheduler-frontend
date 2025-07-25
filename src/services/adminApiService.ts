// services/apiService.ts
import { ApiResponse, DashboardResponse, ApiError } from '../types/adminDashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    return this.request<DashboardResponse>('/admin/dashboard');
  }
}

export const apiService = new ApiService();
