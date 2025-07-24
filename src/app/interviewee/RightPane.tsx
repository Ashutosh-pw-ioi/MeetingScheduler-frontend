"use client";

import React from "react";
import CalendarComponent from "./CalendarComponent";

interface RightPaneProps {
  onDateClick?: (date: Date) => void; // Only single date selection
}

export default function RightPane({ onDateClick }: RightPaneProps) {
  const handleDateClick = (date: Date | Date[]) => {
    if (!Array.isArray(date)) {
      onDateClick?.(date);
    }
  };

  return (
    <div className="bg-white rounded-r-xl px-6 sm:px-8 py-4 sm:py-6 flex flex-col items-start justify-start space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-left">
        Select Date and Time
      </h2>

      <CalendarComponent onDateClick={handleDateClick} multiSelect={false} />

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:w-[90%]">
        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <p className="text-sm text-gray-800 leading-tight">
          Please cautiously select your preferred date and time. Once confirmed,
          changes may not be possible.
        </p>
      </div>
    </div>
  );
}
