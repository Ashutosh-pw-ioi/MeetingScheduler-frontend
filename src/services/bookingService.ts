// services/bookingService.ts
import axios from "axios";
import { 
  BookingResponse, 
  BookingAxiosError, 
  NetworkError, 
  FormData, 
  BookingRequest, 
  TimeSlotData,
  StudentAuthRequest,
  StudentAuthApiResponse
} from '../types/booking';

export const getBookingStartTime = (): string => {
  const selectedTimeSlot = localStorage.getItem("selectedTimeSlot");
  if (selectedTimeSlot) {
    try {
      const slotData: TimeSlotData = JSON.parse(selectedTimeSlot) as TimeSlotData;
      if (slotData.startTimeISO && typeof slotData.startTimeISO === 'string') {
        console.log("Using startTimeISO from localStorage:", slotData.startTimeISO);
        return slotData.startTimeISO;
      }
    } catch (error) {
      console.error("Error parsing selected time slot:", error);
    }
  }
  
  console.warn("Using fallback method to construct start time");
  try {
    const selectedDate = localStorage.getItem("selectedDate");
    const dateToUse = selectedDate || new Date().toISOString();
    const selectedDateObj = new Date(dateToUse);
    if (isNaN(selectedDateObj.getTime())) {
      throw new Error("Invalid selected date");
    }
    return selectedDateObj.toISOString();
  } catch (error) {
    console.error("Error creating fallback start time:", error);
    return new Date().toISOString();
  }
};

// NEW: Check student authorization
export const checkStudentAuthorization = async (phone: string): Promise<StudentAuthApiResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  const authData: StudentAuthRequest = { phone };

  console.log("Checking student authorization:", authData);

  const response = await axios.post<StudentAuthApiResponse>(
    `${baseUrl}/api/student/checkStudents`,
    authData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );

  return response.data;
};

export const bookInterview = async (formData: FormData): Promise<BookingResponse> => {
  const startTimeISO = getBookingStartTime();
  const bookingData: BookingRequest = {
    startTime: startTimeISO,
    studentName: formData.name.trim(),
    studentEmail: formData.email.trim(),
    studentPhone: formData.phone.trim(),
  };

  console.log("Sending booking request:", bookingData);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  const response = await axios.post<BookingResponse>(
    `${baseUrl}/api/booking/book`,
    bookingData,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  return response.data;
};

export const handleBookingError = (error: unknown): string => {
  console.error("Booking failed:", error);
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as BookingAxiosError;
    if (axiosError.response?.data) {
      return axiosError.response.data.message;
    } else if (axiosError.request) {
      return "Network error. Please check your connection and try again.";
    } else {
      return "An unexpected error occurred. Please try again.";
    }
  } else if (error instanceof Error) {
    const networkError = error as NetworkError;
    if (networkError.code === 'ECONNABORTED') {
      return "Request timeout. Please try again.";
    } else {
      return `Error: ${networkError.message}`;
    }
  } else {
    return "An unexpected error occurred. Please try again.";
  }
};

// NEW: Handle authorization error
export const handleAuthorizationError = (error: unknown): string => {
  console.error("Authorization check failed:", error);
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as BookingAxiosError;
    if (axiosError.response?.data) {
      return axiosError.response.data.message;
    } else if (axiosError.request) {
      return "Network error. Please check your connection and try again.";
    } else {
      return "An unexpected error occurred during authorization check.";
    }
  } else if (error instanceof Error) {
    const networkError = error as NetworkError;
    if (networkError.code === 'ECONNABORTED') {
      return "Authorization check timeout. Please try again.";
    } else {
      return `Authorization Error: ${networkError.message}`;
    }
  } else {
    return "An unexpected error occurred during authorization check.";
  }
};
