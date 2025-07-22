"use client";

import React, { useState } from "react";
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

const dummySlots = [
  "10:00pm",
  "10:30pm",
  "11:00pm",
  "11:30pm",
  "12:00pm",
  "12:30pm",
  "01:00pm",
  "01:30pm",
  "02:00pm",
  "02:30pm",
  "03:00pm",
  "03:30pm",
  "04:00pm",
  "04:30pm",
  "05:00pm",
  "05:30pm",
];

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

  const handleNext = (index: number) => {
    setActiveIndex(index);
  };

  const handleSubmit = () => {
    if (activeIndex !== null) {
      setIsModalOpen(true);
      localStorage.setItem("selectedTime", dummySlots[activeIndex]);
    } else {
      console.error("No slot selected!");
    }
  };

  const handleFormDataChange = (newFormData: FormData) => {
    setFormData(newFormData);
    localStorage.setItem("interviewFormData", JSON.stringify(newFormData));
  };

  const handleModalConfirm = () => {
    const appointmentData = {
      date: selectedDate?.toISOString(),
      time: activeIndex !== null ? dummySlots[activeIndex] : "",
      formData: formData,
    };

    localStorage.setItem("appointmentData", JSON.stringify(appointmentData));

    console.log(
      `Date: ${selectedDate} | Time: ${
        activeIndex !== null ? dummySlots[activeIndex] : ""
      } | Form Data:`,
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

  return (
    <>
      <div className="bg-white rounded-r-xl px-6 sm:px-8 sm:pl-0 py-4 sm:py-6 sm:pb-0 flex flex-col items-start justify-start space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-left">
          {selectedDate?.toLocaleDateString()}
        </h2>
        <div className="flex flex-col gap-2 overflow-y-scroll w-full max-h-[475px]">
          {dummySlots.map((slot, index) => (
            <div
              className="flex items-center justify-between w-full gap-3"
              key={index}
            >
              <button
                className="py-2 px-4 border-2 border-black rounded-md text-center cursor-pointer w-full"
                onClick={() => handleNext(index)}
              >
                {slot}
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
          ))}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        selectedDate={selectedDate?.toISOString() || ""}
        selectedTime={activeIndex !== null ? dummySlots[activeIndex] : ""}
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />
    </>
  );
}
