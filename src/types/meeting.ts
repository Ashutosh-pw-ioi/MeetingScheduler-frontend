export interface Meeting {
  id?: string | number;
  student_name: string;
  student_email: string;
  student_phone: string | null;
  scheduled_date: string;
  scheduled_time: string;
  meeting_link: string | null;
}

export interface CategorizedMeetings {
  todays: Meeting[];
  upcoming: Meeting[];
  past: Meeting[];
}

export type MeetingsApiResponse = CategorizedMeetings;