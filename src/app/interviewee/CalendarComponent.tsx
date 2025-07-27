"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";

interface CalendarComponentProps {
  onDateClick?: (date: Date | Date[]) => void;
  multiSelect?: boolean;
}

export default function CalendarComponent({
  onDateClick,
  multiSelect = false,
}: CalendarComponentProps) {
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(
    undefined
  );
  const [multiDates, setMultiDates] = React.useState<Date[] | undefined>(
    undefined
  );

  const today = new Date();
  const highlightedDates = Array.from({ length: 5 }, (_, i) => {
    const highlightDate = new Date(today);
    highlightDate.setDate(today.getDate() + i);
    return highlightDate;
  });

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const handleSingleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      console.log("Single date clicked:", selectedDate);
      console.log("Formatted date:", selectedDate.toLocaleDateString());
      onDateClick?.(selectedDate);
    }
    setSingleDate(selectedDate);
  };

  const handleMultiDateSelect = (selectedDates: Date[] | undefined) => {
    if (selectedDates) {
      console.log("Multi dates selected:", selectedDates);
      console.log(
        "Formatted dates:",
        selectedDates.map((date) => date.toLocaleDateString())
      );
      onDateClick?.(selectedDates);
    }
    setMultiDates(selectedDates);
  };

  if (multiSelect) {
    return (
      <Calendar
        showOutsideDays={false}
        mode="multiple"
        selected={multiDates}
        onSelect={handleMultiDateSelect}
        className="rounded-lg border border-black w-full [&_button]:cursor-pointer [&_td]:cursor-pointer [&_td]:p-1"
        modifiers={{
          highlighted: highlightedDates,
          today: todayDate,
        }}
        modifiersClassNames={{
          highlighted: "bg-gray-100 text-gray-900",
          today: "underline",
        }}
        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
      />
    );
  }

  return (
    <Calendar
      showOutsideDays={false}
      mode="single"
      selected={singleDate}
      onSelect={handleSingleDateSelect}
      className="rounded-lg border border-black max-h-[500px] w-full [&_button]:cursor-pointer [&_td]:cursor-pointer"
      modifiers={{
        highlighted: highlightedDates,
        today: todayDate,
      }}
      modifiersClassNames={{
        highlighted: "bg-gray-100 text-gray-900",
        today: "underline",
      }}
      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
    />
  );
}
