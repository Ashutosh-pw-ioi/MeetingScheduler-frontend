export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  calendarConnected: boolean;
}

export interface CalendarStatus {
  hasCalendarAccess: boolean;
  needsCalendarPermission: boolean;
  calendarAuthUrl: string | null;
  error?: string;
}

export interface AuthResponse {
  user: User;
}

export interface AuthError {
  error: string;
}
