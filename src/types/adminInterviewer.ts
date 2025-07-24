// types/interviewer.types.ts
export interface Meeting {
  intervieweeName: string;
  intervieweeEmail: string;
  date: string;
  time: string;
  meetingLink: string;
}

export interface Interviewer {
  id: string; // Backend UUID
  displayId?: number; // Frontend display ID
  name: string;
  email: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  meetings: Meeting[];
}

export interface InterviewerTableData {
  id: string; // Backend UUID for operations
  displayId: number; // Frontend display ID (1, 2, 3...)
  name: string;
  email: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  meetings: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
