"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarComponentProps {
  onDateClick?: (date: Date) => void;
}

export default function CalendarComponent({
  onDateClick,
}: CalendarComponentProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const today = new Date();
  const highlightedDates = Array.from({ length: 15 }, (_, i) => {
    const highlightDate = new Date(today);
    highlightDate.setDate(today.getDate() + i);
    return highlightDate;
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      console.log("Clicked date:", selectedDate);
      console.log("Formatted date:", selectedDate.toLocaleDateString());
      onDateClick?.(selectedDate);
    }
    setDate(selectedDate);
  };

  return (
    <Calendar
      showOutsideDays={false}
      mode="single"
      selected={date}
      onSelect={handleDateSelect}
      className="rounded-lg border border-black max-h-[500px] w-full [&_button]:cursor-pointer [&_td]:cursor-pointer"
      modifiers={{
        highlighted: highlightedDates,
      }}
      modifiersClassNames={{
        highlighted: "bg-gray-100 text-gray-900",
      }}
      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
    />
  );
}
