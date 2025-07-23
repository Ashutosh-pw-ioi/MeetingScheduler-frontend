// types/interviewee.types.ts
export interface IntervieweeDetails {
  interviewerName: string;
  date: string;
  time: string;
  meetingLink: string;
}

export interface Interviewee {
  name: string;
  email: string;
  phone: string;
  slotBooked: boolean;
  details?: IntervieweeDetails;
}

export interface IntervieweeTableData {
  sno: number;
  name: string;
  email: string;
  phone: string;
  slotBooked: string;
  details: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
