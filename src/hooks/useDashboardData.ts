// src/hooks/useDashboardData.ts

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/adminApiService';
import {
  DashboardResponse,
  TransformedBarData,
} from '../types/adminDashboard';

interface UseDashboardDataReturn {
  dashboardData: DashboardResponse | null;
  transformedBarData: TransformedBarData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [transformedBarData, setTransformedBarData] = useState<TransformedBarData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getDashboard();
      if (response.success && response.data) {
        setDashboardData(response.data);
        const transformed = response.data.barChartData.map((item) => ({
          category: item.name,
          value: item.interviews,
        }));
        setTransformedBarData(transformed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    transformedBarData,
    loading,
    error,
    refetch,
  };
};
