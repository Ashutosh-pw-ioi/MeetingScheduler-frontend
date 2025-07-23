import { api } from '@/lib/api';
import { User, CalendarStatus } from '@/types/auth';

export class AuthService {
  static async checkAuth(): Promise<User | null> {
    try {
      console.log('Making auth check request...');
      const response = await api.get<User>('/auth/profile');
      console.log('Auth check successful:', response.data);
      return response.data;
    } catch (error) {
      console.log('Auth check failed:', error);
      return null;
    }
  }

  static async checkCalendarStatus(): Promise<CalendarStatus | null> {
    try {
      const response = await api.get<CalendarStatus>('/auth/calendar-status');
      return response.data;
    } catch (error) {
      console.error('Calendar status check failed:', error);
      return null;
    }
  }

  static getGoogleAuthUrl(role: string): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google?role=${role}`;
  }

  static getCalendarAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/google/calendar`;
  }

  static getLogoutUrl(): string {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/logout`;
  }
}
