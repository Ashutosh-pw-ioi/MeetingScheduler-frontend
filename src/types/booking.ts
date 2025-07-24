export interface FormData {
  name: string;
  email: string;
  phone: string;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDate: string;
  selectedTime: string;
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
}

export interface FormErrors {
  name: string;
  email: string;
  phone: string;
}

export interface TouchedFields {
  name: boolean;
  email: boolean;
  phone: boolean;
}

export interface TimeSlotData {
  startTimeISO?: string;
  [key: string]: unknown;
}

export interface BookingResponse {
  message: string;
  booking: {
    id: string;
    startTime: string;
    endTime: string;
    startTimeIST: string;
    endTimeIST: string;
    timezone: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
  };
  interviewer: {
    name: string;
    email: string;
  };
  meetingLink?: string;
  importantNote?: string;
  requiresInterviewerAction?: boolean;
  calendarError?: boolean;
}

export interface BookingErrorResponse {
  message: string;
  existingBooking?: {
    id: string;
    startTime: string;
    timezone: string;
    interviewerName: string;
    status: string;
  };
  canBook: boolean;
}

export interface BookingRequest {
  startTime: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

export type BookingAxiosError = import("axios").AxiosError<BookingErrorResponse>;

export interface NetworkError extends Error {
  code?: string;
  request?: unknown;
}

export interface StudentAuthRequest {
  phone: string;
}

export interface StudentAuthResponse {
  authorized: boolean;
  message: string;
}

export interface StudentAuthApiResponse {
  success: boolean;
  data: StudentAuthResponse;
  message: string;
}