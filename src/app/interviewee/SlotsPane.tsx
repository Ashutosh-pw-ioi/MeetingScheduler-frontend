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
                  null
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
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Slots Available
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              No interview slots available for Today! Please try again later.
            </p>
          </div>

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
