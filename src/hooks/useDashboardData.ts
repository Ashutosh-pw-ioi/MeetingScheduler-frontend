// hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/adminApiService';
import { DashboardResponse, TransformedBarData } from '../types/adminDashboard';

interface UseDashboardDataReturn {
  dashboardData: DashboardResponse | null;
  transformedBarData: TransformedBarData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transformedBarData, setTransformedBarData] = useState<TransformedBarData[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getDashboard();
      
      if (response.success && response.data) {
        setDashboardData(response.data);
        
        // Transform bar chart data to match existing UI expectations
        const transformed: TransformedBarData[] = response.data.barChartData.map((item) => ({
          category: item.name,
          value: item.interviews,
        }));
        setTransformedBarData(transformed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    dashboardData,
    transformedBarData,
    loading,
    error,
    refetch,
  };
};
