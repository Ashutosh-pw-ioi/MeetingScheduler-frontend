// hooks/useIntervieweeData.ts
import { useState, useEffect, useCallback } from 'react';
import { intervieweeService } from '../services/adminIntervieweeService';
import { Interviewee, IntervieweeTableData } from '../types/adminInterviewees.types';

interface UseIntervieweeDataReturn {
  intervieweesData: Interviewee[];
  tableData: IntervieweeTableData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useIntervieweeData = (): UseIntervieweeDataReturn => {
  const [intervieweesData, setIntervieweesData] = useState<Interviewee[]>([]);
  const [tableData, setTableData] = useState<IntervieweeTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformToTableData = useCallback((data: Interviewee[]): IntervieweeTableData[] => {
    return data.map((interviewee, index) => ({
      sno: index + 1, // Incremental ID starting from 1
      name: interviewee.name,
      email: interviewee.email,
      phone: interviewee.phone,
      slotBooked: interviewee.slotBooked ? "Booked" : "Not Booked",
      details: interviewee.slotBooked ? "View" : "-",
    }));
  }, []);

  const fetchInterviewees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await intervieweeService.getAllInterviewees();
      
      if (response.success && response.data) {
        setIntervieweesData(response.data);
        setTableData(transformToTableData(response.data));
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch interviewee data';
      setError(errorMessage);
      console.error('Interviewee data fetch error:', err);
      
      // Set empty arrays on error to maintain UI consistency
      setIntervieweesData([]);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [transformToTableData]);

  const refetch = useCallback(async () => {
    await fetchInterviewees();
  }, [fetchInterviewees]);

  useEffect(() => {
    fetchInterviewees();
  }, [fetchInterviewees]);

  return {
    intervieweesData,
    tableData,
    loading,
    error,
    refetch,
  };
};
