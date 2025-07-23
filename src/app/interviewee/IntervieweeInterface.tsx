"use client";

import { useState, useEffect } from "react";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import SlotsPane from "./SlotsPane";
import SuccessComponent from "./SuccessComponent";

export default function InterviewScheduler() {
  const [isSlotsPane, setIsSlotsPane] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const [appointmentData, setAppointmentData] = useState<string | null>(null);
  const [interviewFormData, setInterviewFormData] = useState<string | null>(
    null
  );

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    const storedAppointment = localStorage.getItem("appointmentData");
    const storedForm = localStorage.getItem("interviewFormData");

    setAppointmentData(storedAppointment);
    setInterviewFormData(storedForm);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleDateClick = (clickedDate: Date) => {
    setIsSlotsPane(true);
    setSelectedDate(clickedDate);
    localStorage.setItem("selectedDate", clickedDate.toDateString());
  };

  const refreshLocalStorageData = () => {
    setAppointmentData(localStorage.getItem("appointmentData"));
    setInterviewFormData(localStorage.getItem("interviewFormData"));
  };

  return (
    <div className="min-h-screen sm:p-4 flex items-center justify-center bg-[#fafafa]">
      <div
        className={`${
          appointmentData && interviewFormData
            ? "max-w-4xl"
            : isSlotsPane
            ? "max-w-5xl"
            : "max-w-3xl"
        } w-full border-[0.25px] border-black rounded-xl shadow-xl sm:px-2 bg-white`}
      >
        <div
          className={`grid grid-cols-1 ${
            appointmentData && interviewFormData
              ? "lg:grid-cols-2"
              : isSlotsPane
              ? "lg:grid-cols-[1fr_1.25fr_0.75fr]"
              : "lg:grid-cols-2"
          }`}
        >
          <LeftPane />

          {appointmentData && interviewFormData ? (
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
