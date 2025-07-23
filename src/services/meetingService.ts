import { api } from '@/lib/api';
import { CategorizedMeetings } from '../types/meeting';

export class MeetingsService {
  static async getAllMeetings(): Promise<CategorizedMeetings> {
    try {
      console.log('Fetching all meetings from API...');
      const response = await api.get<CategorizedMeetings>('/api/availability/allMeetings');
      console.log('Meetings data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      throw new Error('Failed to fetch meetings data');
    }
  }

  static formatMeetingForTable(meeting: Meeting, index: number): Meeting {
    return {
      id: meeting.id || `meeting-${index}`,
      student_name: meeting.student_name,
      student_email: meeting.student_email,
      student_phone: meeting.student_phone || 'Not provided',
      scheduled_date: meeting.scheduled_date,
      scheduled_time: meeting.scheduled_time,
      meeting_link: meeting.meeting_link || 'Not available'
    };
  }
}
