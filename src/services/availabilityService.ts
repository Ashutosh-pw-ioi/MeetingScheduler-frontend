import { api } from '@/lib/api';
import { 
  AvailabilityResponse, 
  BatchSetAvailabilityRequest, 
  DayAvailabilityRequest, 
  DeleteRangeRequest,
  AvailabilityApiResponse 
} from '../types/availabilty';

export class AvailabilityService {
  static async getAllAvailability(): Promise<AvailabilityResponse[]> {
    try {
      const response = await api.get<AvailabilityResponse[]>('/api/availability/all');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      throw new Error('Failed to fetch availability data');
    }
  }

  static async setBatchAvailability(data: BatchSetAvailabilityRequest): Promise<AvailabilityApiResponse> {
    try {
      const response = await api.post<AvailabilityApiResponse>('/api/availability/batch-set', data);
      return response.data;
    } catch (error) {
      console.error('Failed to set batch availability:', error);
      throw new Error('Failed to save availability data');
    }
  }

  static async setDayAvailability(data: DayAvailabilityRequest): Promise<AvailabilityApiResponse> {
    try {
      const response = await api.post<AvailabilityApiResponse>('/api/availability/day', data);
      return response.data;
    } catch (error) {
      console.error('Failed to set day availability:', error);
      throw new Error('Failed to save day availability');
    }
  }

  static async deleteAvailabilityRange(data: DeleteRangeRequest): Promise<AvailabilityApiResponse> {
    try {
      const response = await api.delete<AvailabilityApiResponse>('/api/availability/range', {
        data: data
      });
      return response.data;
    } catch (error) {
      console.error('Failed to delete availability range:', error);
      throw new Error('Failed to delete availability');
    }
  }
}
