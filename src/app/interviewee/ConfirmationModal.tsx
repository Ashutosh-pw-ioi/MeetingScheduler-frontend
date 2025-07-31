import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Calendar, Clock, Loader2, AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookingData: any) => void;
  selectedDate: string;
  selectedTime: string;
}

interface StudentData {
  name: string;
  email: string;
  phone: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  selectedTime,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedData = localStorage.getItem("interviewFormData");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setStudentData(parsedData);
        } catch (err) {
          console.error("Error parsing student data from localStorage:", err);
          setError(
            "Student information not found. Please fill the form again."
          );
        }
      } else {
        setError("Student information not found. Please fill the form again.");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime()) || date.toString() === "Invalid Date") {
        return dateStr;
      }
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  const parseTimeString = (
    timeStr: string
  ): { hours: number; minutes: number } => {
    try {
      if (
        timeStr.toLowerCase().includes("am") ||
        timeStr.toLowerCase().includes("pm")
      ) {
        const isPM = timeStr.toLowerCase().includes("pm");
        const timeOnly = timeStr.replace(/[ap]m/i, "").trim();
        const [hours, minutes] = timeOnly
          .split(":")
          .map((num) => parseInt(num, 10));

        let adjustedHours = hours;
        if (isPM && hours !== 12) {
          adjustedHours += 12;
        } else if (!isPM && hours === 12) {
          adjustedHours = 0;
        }

        return { hours: adjustedHours, minutes: minutes || 0 };
      }

      const [hours, minutes] = timeStr
        .split(":")
        .map((num) => parseInt(num, 10));
      return { hours: hours || 0, minutes: minutes || 0 };
    } catch (error) {
      throw new Error(`Invalid time format: ${timeStr}, ${error}`);
    }
  };

  const createValidDateTime = (dateStr: string, timeStr: string): Date => {
    try {
      let baseDate: Date;

      if (dateStr.includes("T") || dateStr.includes("Z")) {
        baseDate = new Date(dateStr);
      } else {
        baseDate = new Date(dateStr);
      }

      if (isNaN(baseDate.getTime())) {
        throw new Error(`Invalid date: ${dateStr}`);
      }

      const { hours, minutes } = parseTimeString(timeStr);

      const finalDate = new Date(baseDate);
      finalDate.setHours(hours, minutes, 0, 0);

      if (isNaN(finalDate.getTime())) {
        throw new Error(`Invalid date/time combination: ${dateStr} ${timeStr}`);
      }

      return finalDate;
    } catch (error: any) {
      throw new Error(`Failed to create valid date: ${error.message}`);
    }
  };

  const handleConfirmBooking = async () => {
    if (!studentData) {
      setError("Student information not found. Please fill the form again.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!selectedDate || !selectedTime) {
        throw new Error("Please select both date and time for the interview.");
      }

      const dateObject = createValidDateTime(selectedDate, selectedTime);
      const startTime = dateObject.toISOString();

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const endpoint = `${apiUrl}/api/booking/book`;

      const requestPayload = {
        startTime,
        studentName: studentData.name,
        studentEmail: studentData.email,
        studentPhone: studentData.phone,
      };

      const response = await axios.post(endpoint, requestPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        validateStatus: (status) => {
          return status === 201 || status === 206;
        },
      });

      localStorage.setItem("bookingConfirmed", "true");
      localStorage.setItem("bookingSuccess", JSON.stringify(response.data));
      window.location.reload();

      onConfirm(response.data);

      handleClose();
    } catch (err) {
      console.error("Booking error:", err);
      let errorMessage = "An unexpected error occurred";

      if (axios.isAxiosError(err)) {
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 sm:max-w-2xl transform transition-all flex flex-col max-h-[95vh] sm:max-h-[90vh]">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              <AlertCircle className="text-red-600 mr-2" size={24} />
              <h2 className="text-lg sm:text-xl font-semibold text-black">
                Booking Failed
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-600 hover:text-black transition-colors cursor-pointer p-1"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 sm:p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              onClick={handleClose}
              type="button"
              className="flex-1 px-4 py-3 text-black bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-100 ease-in-out font-medium cursor-pointer text-sm sm:text-base"
            >
              Close
            </button>
            <button
              onClick={() => {
                setError(null);
                handleConfirmBooking();
              }}
              type="button"
              className="flex-1 px-4 py-3 bg-black text-white hover:bg-gray-950 cursor-pointer rounded-md transition-colors font-medium duration-100 ease-in-out text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main confirmation modal
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 sm:max-w-2xl transform transition-all flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Confirm Your Interview
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black transition-colors cursor-pointer p-1"
            type="button"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium text-black mb-4">
              Interview Details
            </h3>
            <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
              Please confirm your interview details with the Institute of
              Innovation:
            </p>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200">
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

              <div className="flex items-start mb-4">
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

            <div className="text-sm text-gray-700">
              <p className="mb-2">
                Duration: <strong>30 minutes</strong>
              </p>
              <p>A joining link will be shared once confirmed.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleClose}
            type="button"
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-black bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-100 ease-in-out font-medium cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBooking}
            type="button"
            disabled={isLoading || !studentData}
            className="flex-1 px-4 py-3 bg-black text-white hover:bg-gray-950 cursor-pointer rounded-md transition-colors font-medium duration-100 ease-in-out text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Booking...
              </>
            ) : (
              "Confirm Interview"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
