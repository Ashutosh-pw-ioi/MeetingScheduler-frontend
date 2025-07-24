"use client";

import { useState } from "react";
import CalendarComponent from "@/app/interviewee/CalendarComponent";
import EmptyList from "../EmptyList";
import { slotsData } from "../constants/SlotsData";
import { CirclePlus, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

interface DateSlots {
  [dateKey: string]: TimeSlot[];
}

export default function AddSlotsSection() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateSlots, setDateSlots] = useState<DateSlots>({});

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        const time12 = formatTo12Hour(hour, minute);
        const time24 = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        times.push({ value: time24, label: time12 });
      }
    }
    return times;
  };

  const formatTo12Hour = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const timeOptions = generateTimeOptions();

  const handlePlusClick = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];

    // Create a more unique ID using date and random number
    const uniqueId = `slot-${dateKey}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newSlot: TimeSlot = {
      id: uniqueId,
      startTime: "09:00",
      endTime: "09:30",
    };

    console.log(`Adding slot to date: ${dateKey}`, newSlot); // Debug log

    setDateSlots((prevDateSlots) => {
      const currentSlotsForDate = prevDateSlots[dateKey] || [];
      const updatedSlots = {
        ...prevDateSlots,
        [dateKey]: [...currentSlotsForDate, newSlot],
      };

      console.log("Updated dateSlots:", updatedSlots); // Debug log
      return updatedSlots;
    });
  };

  const handleTimeChange = (
    dateKey: string,
    slotId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setDateSlots((prev) => ({
      ...prev,
      [dateKey]:
        prev[dateKey]?.map((slot) => {
          if (slot.id === slotId) {
            const updatedSlot = { ...slot, [field]: value };

            if (field === "startTime" && value >= updatedSlot.endTime) {
              const startIndex = timeOptions.findIndex(
                (t) => t.value === value
              );
              const nextTimeOption = timeOptions[startIndex + 1];
              if (nextTimeOption) {
                updatedSlot.endTime = nextTimeOption.value;
              }
            }

            return updatedSlot;
          }
          return slot;
        }) || [],
    }));
  };

  const handleEditSlot = (dateKey: string, slotId: string) => {
    console.log("Edit slot:", dateKey, slotId);
  };

  const handleDeleteSlot = (dateKey: string, slotId: string) => {
    setDateSlots((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter((slot) => slot.id !== slotId) || [],
    }));
  };

  const calculateSlotCount = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const totalMinutes = endTotalMinutes - startTotalMinutes;
    return Math.floor(totalMinutes / 30);
  };

  const getValidEndTimeOptions = (startTime: string) => {
    const startIndex = timeOptions.findIndex(
      (option) => option.value === startTime
    );
    return timeOptions.filter((_, index) => index > startIndex);
  };

  const handleMultipleDatesSelection = (dates: Date | Date[]) => {
    if (Array.isArray(dates)) {
      setSelectedDates(dates);
      console.log("Selected dates:", dates);
      console.log(
        "Formatted dates:",
        dates.map((date) => date.toLocaleDateString())
      );

      processSelectedDates(dates);
    }
  };

  const processSelectedDates = (dates: Date[]) => {
    const dateStrings = dates.map((date) => date.toISOString());

    const datesByMonth = dates.reduce((acc, date) => {
      const monthKey = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(date);
      return acc;
    }, {} as Record<string, Date[]>);
  };

  const getSelectedDates = (): Date[] => {
    return selectedDates;
  };

  return (
    <div className="px-0 sm:px-2 py-6 relative max-w-6xl">
      {slotsData.length > 0 ? (
        <div className="w-full space-y-8">
          <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-left">
            Manage Your Slots
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="w-full md:w-1/2">
              <CalendarComponent
                multiSelect={true}
                onDateClick={handleMultipleDatesSelection}
              />
            </div>

            <div className="w-full md:w-1/2">
              <div className="sm:bg-white rounded-lg sm:border border-black/25 sm:p-6 max-h-[100vh] sm:max-h-[550px] overflow-y-auto">
                {getSelectedDates().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-center">
                    <div className="text-base sm:text-lg font-medium mb-1">
                      Select dates from calendar
                    </div>
                    <div className="text-sm">
                      Choose one or more dates to start adding time slots
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {getSelectedDates()
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((selDate, index) => {
                        const dateKey = selDate.toISOString().split("T")[0];
                        const slotsForDate = dateSlots[dateKey] || [];

                        return (
                          <div
                            key={`${dateKey}-${index}`} // More unique key
                            className="border border-black/25 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4">
                              <div className="text-md font-semibold text-gray-800">
                                {selDate.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              <button
                                className="flex items-center gap-1 px-3 py-2 md:py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm cursor-pointer"
                                onClick={() => handlePlusClick(selDate)}
                              >
                                <CirclePlus className="w-4 h-4" />
                                <span className="hidden lg:block">
                                  Add Slot
                                </span>
                              </button>
                            </div>

                            <div className="space-y-3">
                              {slotsForDate.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  No time slots added yet
                                  <br />
                                  <span className="text-xs">
                                    Click &quot;Add Slot&quot; to create your first time
                                    slot
                                  </span>
                                </div>
                              ) : (
                                slotsForDate.map((slot) => {
                                  const slotCount = calculateSlotCount(
                                    slot.startTime,
                                    slot.endTime
                                  );
                                  const validEndTimes = getValidEndTimeOptions(
                                    slot.startTime
                                  );

                                  return (
                                    <div
                                      key={slot.id}
                                      className="bg-white rounded-lg border border-black p-3 md:p-4 shadow-sm"
                                    >
                                      <div className="flex flex-row items-start md:items-center gap-2 md:gap-3 mb-2 md:justify-between">
                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                          <select
                                            value={slot.startTime}
                                            onChange={(e) =>
                                              handleTimeChange(
                                                dateKey,
                                                slot.id,
                                                "startTime",
                                                e.target.value
                                              )
                                            }
                                            className="w-full sm:w-auto py-2 border border-gray-300 rounded-md text-sm appearance-none pr-0 pl-3 sm:pr-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                                          >
                                            {timeOptions.map((time) => (
                                              <option
                                                key={time.value}
                                                value={time.value}
                                              >
                                                {time.label}
                                              </option>
                                            ))}
                                          </select>

                                          <span className="text-gray-600 font-medium text-sm">
                                            to
                                          </span>

                                          <select
                                            value={slot.endTime}
                                            onChange={(e) =>
                                              handleTimeChange(
                                                dateKey,
                                                slot.id,
                                                "endTime",
                                                e.target.value
                                              )
                                            }
                                            className="w-full sm:w-auto py-2 border border-gray-300 rounded-md text-sm appearance-none pr-0 pl-3 sm:pr-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
                                          >
                                            {validEndTimes.map((time) => (
                                              <option
                                                key={time.value}
                                                value={time.value}
                                              >
                                                {time.label}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <button
                                          onClick={() =>
                                            handleDeleteSlot(dateKey, slot.id)
                                          }
                                          className="p-2 text-black hover:bg-gray-100 rounded-md cursor-pointer"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>

                                      {slotCount > 0 && (
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-2 border-t border-gray-200 text-sm">
                                          <div className="text-gray-600 mb-1 md:mb-0">
                                            Total duration: {slotCount * 30}{" "}
                                            minutes
                                          </div>
                                          <div className="bg-gray-100 px-3 py-1 rounded-full font-medium">
                                            {slotCount} slots available
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen">
          <EmptyList taskType="meetings" />
        </div>
      )}
    </div>
  );
}
