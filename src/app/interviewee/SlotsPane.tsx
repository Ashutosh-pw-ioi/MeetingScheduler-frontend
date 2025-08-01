"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";

interface SlotsPaneProps {
  selectedDate: Date | null;
  refreshData: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  startTimeISO: string;
  endTimeISO: string;
  displayTime: string;
}

interface AvailabilityData {
  availability: Record<string, TimeSlot[]>;
  timezone: string;
  note: string;
}

export default function SlotsPane({
  selectedDate,
  refreshData,
}: SlotsPaneProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("interviewFormData");
      if (savedFormData) {
        try {
          setFormData(JSON.parse(savedFormData));
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !formData.phone) return;

    const getApiUrl = (phone: string) => {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      return `${baseUrl}/api/booking/availability/${encodeURIComponent(phone)}`;
    };

    const apiUrl = getApiUrl(formData.phone);
    console.log("Fetching from API URL:", apiUrl);

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<AvailabilityData>(apiUrl);
        console.log("Fetched availability data:", response.data);
        setAvailabilityData(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);

        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const message = error.response?.data?.message || error.message;

          switch (status) {
            case 400:
              setError("Phone number is required.");
              break;
            case 404:
              if (message.includes("Student not found")) {
                setError(
                  "Phone number not found in our database. Please verify your registered phone number."
                );
              } else if (message.includes("No interviewers found")) {
                setError(
                  `No interviewers available for your department. Please contact administration.`
                );
              } else if (message.includes("No available slots")) {
                setError(
                  "No interview slots available in the next 15 days. Please try again later."
                );
              } else {
                setError(message);
              }
              break;
            case 500:
              setError("Server error. Please try again later.");
              break;
            default:
              setError(`API Error (${status}): ${message}`);
          }
        } else {
          setError(
            "Failed to load availability data. Please check your internet connection."
          );
        }
      } finally {
        setLoading(false);
        setIsRetrying(false);
      }
    };

    if (formData.phone && formData.phone.length === 10) {
      fetchAvailability();
    } else {
      setLoading(false);
      setError("Please provide a valid 10-digit phone number.");
    }
  }, [isMounted, formData.phone]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);

    const currentFormData = { ...formData };
    setFormData({ ...currentFormData });
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  const getAvailableSlotsForDate = (): TimeSlot[] => {
    if (!selectedDate || !availabilityData) return [];

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    console.log("Selected Date:", selectedDate);
    console.log("Generated Date Key:", dateKey);
    console.log(
      "Available dates in data:",
      Object.keys(availabilityData.availability)
    );
    console.log("Slots for this date:", availabilityData.availability[dateKey]);

    return availabilityData.availability[dateKey] || [];
  };

  const formatStartTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? "pm" : "am";

    return `${hour12}:${minutes}${period}`;
  };

  const availableSlots = getAvailableSlotsForDate();

  const handleNext = (index: number) => {
    setActiveIndex(index);
  };

  const handleSubmit = () => {
    if (activeIndex !== null && availableSlots[activeIndex]) {
      setIsModalOpen(true);
      const selectedSlot = availableSlots[activeIndex];
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedSlot));
        localStorage.setItem(
          "selectedTime",
          formatStartTime(selectedSlot.startTime)
        );
      }
    } else {
      console.error("No slot selected!");
    }
  };

  const handleModalConfirm = () => {
    if (activeIndex === null || !availableSlots[activeIndex]) return;

    const selectedSlot = availableSlots[activeIndex];
    const appointmentData = {
      date: selectedDate?.toISOString(),
      time: formatStartTime(selectedSlot.startTime),
      slotId: selectedSlot.id,
      startTimeISO: selectedSlot.startTimeISO,
      endTimeISO: selectedSlot.endTimeISO,
      formData: formData,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    }

    console.log(
      `Date: ${selectedDate} | Time: ${formatStartTime(
        selectedSlot.startTime
      )} | Slot ID: ${selectedSlot.id} | Form Data:`,
      formData
    );

    refreshData();
    setIsModalOpen(false);
    setActiveIndex(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="mt-2 text-gray-600">
          {formData.phone
            ? "Loading available slots..."
            : "Validating phone number..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.694-.833-3.464 0l-6.928 12c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Slots
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{error}</p>
          </div>

          {(error.includes("No interviewers") ||
            error.includes("department")) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="text-blue-800 font-medium text-sm mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Need Help?
              </h4>
              <div className="space-y-1 text-xs text-blue-700 ml-1">
                <p>• Call: (555) 123-4567</p>
                <p>• Email: support@university.edu</p>
                <p>• Visit: Administration Office</p>
              </div>
            </div>
          )}

          {error.includes("No interview slots available") && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left">
              <h4 className="text-purple-800 font-medium text-sm mb-2">
                Alternative Options:
              </h4>
              <div className="space-y-1 text-xs text-purple-700 ml-1">
                <p>• Check back in a few hours for new slots</p>
                <p>• Contact administration for priority scheduling</p>
                <p>• Request a custom time slot if urgent</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center justify-center px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isRetrying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </>
              )}
            </button>

          </div>

          {error.includes("No interview slots available") && (
            <div className="border-t pt-4 mt-2">
              <p className="text-xs text-gray-500 mb-3">
                Can&lsquo;t find a suitable time?
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium underline">
                Request Custom Time Slot
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-start justify-start space-y-6">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-left">
            {selectedDate?.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
        </div>

        <div className="flex flex-col gap-2 overflow-y-scroll w-full max-h-[450px]">
          {availableSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedDate
                ? "No available slots for this date"
                : "Please select a date to view available slots"}
            </div>
          ) : (
            availableSlots.map((slot, index) => (
              <div
                className="flex items-center justify-between w-full gap-3"
                key={slot.id}
              >
                <button
                  className="py-2 px-4 border-2 border-black rounded-md text-center cursor-pointer w-full"
                  onClick={() => handleNext(index)}
                >
                  {formatStartTime(slot.startTime)}
                </button>
                <button
                  className={`py-2 px-4 border-2 bg-black text-white rounded-md text-center cursor-pointer w-full font-semibold ${
                    activeIndex === index ? "block" : "hidden"
                  }`}
                  onClick={handleSubmit}
                >
                  Next
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        selectedDate={selectedDate?.toISOString() || ""}
        selectedTime={
          activeIndex !== null && availableSlots[activeIndex]
            ? formatStartTime(availableSlots[activeIndex].startTime)
            : ""
        }
      />
    </>
  );
}
