import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import axios, { AxiosError } from "axios";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDate: string;
  selectedTime: string;
  formData: FormData;
  onFormDataChange: (formData: FormData) => void;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
}

interface BookingResponse {
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

interface BookingErrorResponse {
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

type BookingAxiosError = AxiosError<BookingErrorResponse>;

interface NetworkError extends Error {
  code?: string;
  request?: unknown;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  selectedTime,
  formData,
  onFormDataChange,
}) => {
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTouched({
        name: false,
        email: false,
        phone: false,
      });
      setErrors({
        name: "",
        email: "",
        phone: "",
      });
      setIsBooking(false);
      setBookingError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return "Name can only contain letters, spaces, hyphens and apostrophes";
        return "";

      case "email":
        if (!value.trim()) return "Email address is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) return "Please enter a valid phone number";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedFormData = {
      ...formData,
      [field]: value,
    };

    onFormDataChange(updatedFormData);

    if (!touched[field as keyof typeof touched]) {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));
    }

    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    if (bookingError) {
      setBookingError("");
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const getFieldMessage = (field: keyof FormErrors) => {
    if (!touched[field]) {
      if (field === "name" && !formData.name)
        return { text: "Please enter your full name", type: "hint" };
      if (field === "email" && !formData.email)
        return { text: "Please enter your email address", type: "hint" };
    }
    if (errors[field]) {
      return { text: errors[field], type: "error" };
    }
    return null;
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    errors.name === "" &&
    errors.email === "" &&
    errors.phone === "";

  const getBookingStartTime = (): string => {
    const selectedTimeSlot = localStorage.getItem("selectedTimeSlot");
    if (selectedTimeSlot) {
      try {
        const slotData = JSON.parse(selectedTimeSlot);
        if (slotData.startTimeISO) {
          console.log("Using startTimeISO from localStorage:", slotData.startTimeISO);
          return slotData.startTimeISO;
        }
      } catch (error) {
        console.error("Error parsing selected time slot:", error);
      }
    }
    
    console.warn("Using fallback method to construct start time");
    try {
      const selectedDateObj = new Date(selectedDate);
      if (isNaN(selectedDateObj.getTime())) {
        throw new Error("Invalid selected date");
      }
      return selectedDateObj.toISOString();
    } catch (error) {
      console.error("Error creating fallback start time:", error);
      return new Date().toISOString();
    }
  };

  const handleBookingConfirm = async () => {
    if (!isFormValid || isBooking) return;

    setIsBooking(true);
    setBookingError("");

    try {
      const startTimeISO = getBookingStartTime();
      const bookingData = {
        startTime: startTimeISO,
        studentName: formData.name.trim(),
        studentEmail: formData.email.trim(),
        studentPhone: formData.phone.trim(),
      };

      console.log("Sending booking request:", bookingData);

      const response = await axios.post<BookingResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000'}/api/booking/book`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, 
        }
      );

      console.log("Booking successful:", response.data);
      
      localStorage.setItem("bookingSuccess", JSON.stringify(response.data));
      
      onFormDataChange({ name: "", email: "", phone: "" });
      
      onClose();
      onConfirm();

    } catch (error: unknown) {
      console.error("Booking failed:", error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as BookingAxiosError;
        if (axiosError.response?.data) {
          const errorData: BookingErrorResponse = axiosError.response.data;
          setBookingError(errorData.message);
        } else if (axiosError.request) {
          setBookingError("Network error. Please check your connection and try again.");
        } else {
          setBookingError("An unexpected error occurred. Please try again.");
        }
      } else if (error instanceof Error) {
        const networkError = error as NetworkError;
        if (networkError.code === 'ECONNABORTED') {
          setBookingError("Request timeout. Please try again.");
        } else {
          setBookingError(`Error: ${networkError.message}`);
        }
      } else {
        setBookingError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 sm:max-w-4xl transform transition-all flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Confirm Your Interview
          </h2>
          <button
            onClick={onClose}
            disabled={isBooking}
            className="text-gray-600 hover:text-black transition-colors cursor-pointer p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-4 sm:p-6 lg:border-r border-gray-200 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-black mb-4 sm:mb-6">
                Your Information
              </h3>

              {bookingError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{bookingError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 sm:space-y-5 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="Enter your full name"
                    disabled={isBooking}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                      getFieldMessage("name")?.type === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {getFieldMessage("name") && (
                    <div
                      className={`flex items-start mt-2 text-sm ${
                        getFieldMessage("name")?.type === "error"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {getFieldMessage("name")?.type === "error" && (
                        <AlertCircle
                          size={14}
                          className="mr-1 mt-0.5 flex-shrink-0"
                        />
                      )}
                      <span>{getFieldMessage("name")?.text}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="your.email@example.com"
                    disabled={isBooking}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                      getFieldMessage("email")?.type === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {getFieldMessage("email") && (
                    <div
                      className={`flex items-start mt-2 text-sm ${
                        getFieldMessage("email")?.type === "error"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {getFieldMessage("email")?.type === "error" && (
                        <AlertCircle
                          size={14}
                          className="mr-1 mt-0.5 flex-shrink-0"
                        />
                      )}
                      <span>{getFieldMessage("email")?.text}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="+91 12345-67890"
                    disabled={isBooking}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                      touched.phone && errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <div className="flex items-start mt-2 text-red-600 text-sm">
                      <AlertCircle
                        size={14}
                        className="mr-1 mt-0.5 flex-shrink-0"
                      />
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-600 pt-2">
                  All fields are required
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 bg-gray-50 lg:bg-white min-w-0 border-t lg:border-t-0">
              <h3 className="text-base sm:text-lg font-medium text-black mb-4">
                Interview Details
              </h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Please confirm your interview details with the Institute of
                Innovation:
              </p>

              <div className="bg-white lg:bg-gray-50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200">
                <div className="flex items-start mb-4">
                  <Calendar
                    className="text-black mr-3 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-black break-words text-sm sm:text-base">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock
                    className="text-black mr-3 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-black text-sm sm:text-base">
                      {selectedTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-sm text-gray-800">
                  <strong>Note:</strong> Once confirmed, changes may not be
                  possible. Please ensure the selected date and time work for
                  your schedule.
                </p>
              </div>

              <div className="text-sm text-gray-700">
                <p className="mb-2">
                  Duration: <strong>30 minutes</strong>
                </p>
                <p>A joining link will be shared once confirmed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isBooking}
            className="flex-1 px-4 py-3 text-black bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-100 ease-in-out font-medium cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleBookingConfirm}
            disabled={!isFormValid || isBooking}
            className={`flex-1 px-4 py-3 rounded-md transition-colors font-medium duration-100 ease-in-out text-sm sm:text-base ${
              isFormValid && !isBooking
                ? "bg-black text-white hover:bg-gray-950 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isBooking ? "Booking..." : "Confirm Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
