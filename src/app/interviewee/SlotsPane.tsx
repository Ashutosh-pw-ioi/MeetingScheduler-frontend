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
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
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
    if (!isMounted) return;
    
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/booking/availability`;
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<AvailabilityData>(apiUrl);
        console.log("Fetched availability data:", response.data);
        setAvailabilityData(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setError("Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [isMounted]);

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
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    
    console.log("Selected Date:", selectedDate);
    console.log("Generated Date Key:", dateKey);
    console.log("Available dates in data:", Object.keys(availabilityData.availability));
    console.log("Slots for this date:", availabilityData.availability[dateKey]);
    
    return availabilityData.availability[dateKey] || [];
  };

  const formatStartTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const period = hour24 >= 12 ? 'pm' : 'am';
    
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
      if (typeof window !== 'undefined') {
        localStorage.setItem("selectedTimeSlot", JSON.stringify(selectedSlot));
        localStorage.setItem("selectedTime", formatStartTime(selectedSlot.startTime));
      }
    } else {
      console.error("No slot selected!");
    }
  };

  const handleFormDataChange = (newFormData: FormData) => {
    setFormData(newFormData);
    if (typeof window !== 'undefined') {
      localStorage.setItem("interviewFormData", JSON.stringify(newFormData));
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

    if (typeof window !== 'undefined') {
      localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
    }

    console.log(
      `Date: ${selectedDate} | Time: ${formatStartTime(selectedSlot.startTime)} | Slot ID: ${selectedSlot.id} | Form Data:`,
      formData
    );

    refreshData();
    setIsModalOpen(false);
    setActiveIndex(null);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        <p className="mt-2 text-gray-600">Loading available slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-center justify-center h-64">
        <p className="text-red-600 font-semibold">Error loading slots</p>
        <p className="text-gray-600 text-sm mt-1">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-start justify-start space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-left">
          {selectedDate?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>

        <div className="flex flex-col gap-2 overflow-y-scroll w-full max-h-[475px]">
          {availableSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedDate 
                ? "No available slots for this date" 
                : "Please select a date to view available slots"
              }
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
        selectedTime={activeIndex !== null && availableSlots[activeIndex] 
          ? formatStartTime(availableSlots[activeIndex].startTime)
          : ""
        }
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />
    </>
  );
}
