"use client";

import { useState, useEffect } from "react";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import SlotsPane from "./SlotsPane";

export default function InterviewScheduler() {
  const [isSlotsPane, setIsSlotsPane] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleDateClick = (clickedDate: Date) => {
    setIsSlotsPane(true);
    setSelectedDate(clickedDate);
    console.log("Date received in parent:", clickedDate);
  };

  return (
    <div className="min-h-screen sm:p-4 flex items-center justify-center bg-[#fafafa]">
      <div
        className={`${
          isSlotsPane ? "max-w-5xl" : "max-w-4xl"
        } w-full border-[0.25px] border-black rounded-xl shadow-xl sm:px-4 bg-white`}
      >
        <div
          className={`grid grid-cols-1 ${
            isSlotsPane ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
          <LeftPane isSlotsPane={isSlotsPane} setIsSlotsPane={setIsSlotsPane} />
          {(!isMobile || !isSlotsPane) && (
            <RightPane onDateClick={handleDateClick} />
          )}
          {isSlotsPane && <SlotsPane selectedDate={selectedDate} />}
        </div>
      </div>
    </div>
  );
}
