// src/services/apiService.ts

import { ApiResponse, DashboardResponse, ApiError } from '../types/adminDashboard';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorData: ApiError | null = null;
      try {
        errorData = await response.json();
      } catch {
        // swallow JSON parse errors
      }
      throw new Error(
        errorData?.message || `Request failed with status ${response.status}`
      );
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    // No date param since server sends all 3 days data.
    return this.request<DashboardResponse>('/admin/dashboard');
  }
}

export const apiService = new ApiService();
