"use client";

import { useState, useEffect } from "react";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import SlotsPane from "./SlotsPane";
import SuccessComponent from "./SuccessComponent";

interface FormData {
  name: string;
  email: string;
  phone: string;
}

export default function InterviewInterface() {
  const [isSlotsPane, setIsSlotsPane] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const [_interviewFormData, setInterviewFormData] = useState<string | null>(
    null
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const storedForm = localStorage.getItem("interviewFormData");
    const storedBookingStatus = localStorage.getItem("bookingConfirmed");

    setInterviewFormData(storedForm);
    setIsBookingConfirmed(storedBookingStatus === "true");

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleDateClick = (clickedDate: Date, userData: FormData) => {
    setIsSlotsPane(true);
    setSelectedDate(clickedDate);
    localStorage.setItem("selectedDate", clickedDate.toDateString());
    localStorage.setItem("interviewFormData", JSON.stringify(userData));
  };

  const refreshLocalStorageData = () => {
    setInterviewFormData(localStorage.getItem("interviewFormData"));
  };

  return (
    <div className="min-h-screen px-4 sm:p-4 flex items-center justify-center bg-[#fafafa]">
      <div
        className={`${
          isBookingConfirmed
            ? "max-w-4xl"
            : isSlotsPane
            ? "max-w-5xl"
            : "max-w-3xl"
        } w-full border-[0.25px] border-black rounded-xl shadow-xl sm:px-2 bg-white`}
      >
        <div
          className={`grid grid-cols-1 ${
            isBookingConfirmed
              ? "lg:grid-cols-2"
              : isSlotsPane
              ? "lg:grid-cols-[1fr_1.25fr_0.75fr]"
              : "lg:grid-cols-2"
          }`}
        >
          <LeftPane />

          {isBookingConfirmed ? (
            <SuccessComponent />
          ) : (
            <>
              {(!isMobile || !isSlotsPane) && (
                <RightPane onDateClick={handleDateClick} />
              )}
              {isSlotsPane && (
                <SlotsPane
                  selectedDate={selectedDate}
                  refreshData={refreshLocalStorageData}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
