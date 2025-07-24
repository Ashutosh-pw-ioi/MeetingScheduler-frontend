// hooks/useInterviewerData.ts
import { useState, useEffect, useCallback } from 'react';
import { interviewerService } from '../services/adminInterviewerApiService';
import { Interviewer, InterviewerTableData } from '../types/interviewer.types';

interface UseInterviewerDataReturn {
  interviewersData: Interviewer[];
  tableData: InterviewerTableData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInterviewerData = (): UseInterviewerDataReturn => {
  const [interviewersData, setInterviewersData] = useState<Interviewer[]>([]);
  const [tableData, setTableData] = useState<InterviewerTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformToTableData = useCallback((data: Interviewer[]): InterviewerTableData[] => {
    return data.map((interviewer, index) => ({
      id: interviewer.id, // Keep original UUID for internal operations
      displayId: index + 1, // Add incremental display ID
      name: interviewer.name,
      email: interviewer.email,
      totalSlots: interviewer.totalSlots,
      bookedSlots: interviewer.bookedSlots,
      availableSlots: interviewer.availableSlots,
      meetings: `View (${interviewer.meetings.length})`,
    }));
  }, []);

  const fetchInterviewers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await interviewerService.getAllInterviewers();
      
      if (response.success && response.data) {
        // Add display IDs to the main data as well
        const dataWithDisplayIds = response.data.map((interviewer, index) => ({
          ...interviewer,
          displayId: index + 1
        }));
        
        setInterviewersData(dataWithDisplayIds);
        setTableData(transformToTableData(dataWithDisplayIds));
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch interviewer data';
      setError(errorMessage);
      console.error('Interviewer data fetch error:', err);
      
      // Set empty arrays on error to maintain UI consistency
      setInterviewersData([]);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [transformToTableData]);

  const refetch = useCallback(async () => {
    await fetchInterviewers();
  }, [fetchInterviewers]);

  useEffect(() => {
    fetchInterviewers();
  }, [fetchInterviewers]);

  return {
    interviewersData,
    tableData,
    loading,
    error,
    refetch,
  };
};
