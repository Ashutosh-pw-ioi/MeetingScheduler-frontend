"use client";

import { useState, useEffect, useRef } from "react";
import CalendarComponent from "@/app/interviewee/CalendarComponent";
import EmptyList from "../EmptyList";
import {
  CirclePlus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Save,
} from "lucide-react";
import { AvailabilityService } from "@/services/availabilityService";
import { AvailabilityResponse, TimeRange } from "../../../types/availabilty";
import { formatDateKey, createISODateTime } from "../../../lib/dateUtils";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  hasError?: boolean;
  errorMessage?: string;
  isModified?: boolean;
}

interface DateSlots {
  [dateKey: string]: TimeSlot[];
}

const slotsData = [1];

export default function AddSlotsSection() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [dateSlots, setDateSlots] = useState<DateSlots>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const hasInitialized = useRef(false);
  const saveTimeoutRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

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

  const validateTimeSlot = (
    startTime: string,
    endTime: string
  ): { isValid: boolean; error?: string } => {
    if (!startTime || !endTime) {
      return { isValid: false, error: "Both start and end times are required" };
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (startTotalMinutes >= endTotalMinutes) {
      return { isValid: false, error: "Start time must be before end time" };
    }

    if (endTotalMinutes - startTotalMinutes < 30) {
      return { isValid: false, error: "Minimum slot duration is 30 minutes" };
    }

    return { isValid: true };
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadAvailabilityData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        console.log("Loading availability data...");

        const availabilityData: AvailabilityResponse[] =
          await AvailabilityService.getAllAvailability();
        console.log("Raw availability data received:", availabilityData);

        const convertedDateSlots: DateSlots = {};
        const datesWithData: Date[] = [];

        availabilityData.forEach((dayData) => {
          const dateKey = dayData.date;
          console.log(dateKey, "*******");

          const slots: TimeSlot[] = [];

          dayData.timeRanges.forEach((range, index) => {
            const uniqueId = `existing-slot-${dateKey}-${index}-${Date.now()}`;
            const validation = validateTimeSlot(range.startTime, range.endTime);

            slots.push({
              id: uniqueId,
              startTime: range.startTime,
              endTime: range.endTime,
              hasError: !validation.isValid,
              errorMessage: validation.error,
              isModified: false,
            });
          });

          if (slots.length > 0) {
            convertedDateSlots[dateKey] = slots;
            // Parse dateKey in UTC
            const [year, month, day] = dateKey.split("-").map(Number);
            datesWithData.push(new Date(Date.UTC(year, month - 1, day)));
          }
        });

        setDateSlots(convertedDateSlots);
        setSelectedDates(datesWithData);

        console.log("Converted dateSlots:", convertedDateSlots);
        console.log("Auto-selected dates:", datesWithData);

        if (Object.keys(convertedDateSlots).length > 0) {
          setSuccessMessage(
            `Loaded existing availability for ${
              Object.keys(convertedDateSlots).length
            } days`
          );
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } catch (error) {
        console.error("Failed to load availability:", error);
        setError(
          "Failed to load existing availability data. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAvailabilityData();
  }, []);

  const handlePlusClick = (date: Date) => {
    const dateKey = formatDateKey(date);

    console.log("Adding slot for date:", date, "dateKey:", dateKey);

    const uniqueId = `new-slot-${dateKey}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newSlot: TimeSlot = {
      id: uniqueId,
      startTime: "09:00",
      endTime: "09:30",
      hasError: false,
      isModified: true,
    };

    setDateSlots((prevDateSlots) => {
      const currentSlotsForDate = prevDateSlots[dateKey] || [];
      const updatedSlots = {
        ...prevDateSlots,
        [dateKey]: [...currentSlotsForDate, newSlot],
      };

      setHasUnsavedChanges(true);
      console.log("Updated dateSlots after adding:", updatedSlots);
      return updatedSlots;
    });
  };

  const handleTimeChange = (
    dateKey: string,
    slotId: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    console.log(
      "Changing time for dateKey:",
      dateKey,
      "field:",
      field,
      "value:",
      value
    );

    setDateSlots((prev) => ({
      ...prev,
      [dateKey]:
        prev[dateKey]?.map((slot) => {
          if (slot.id === slotId) {
            const updatedSlot = { ...slot, [field]: value, isModified: true };

            if (field === "startTime" && value >= updatedSlot.endTime) {
              const startIndex = timeOptions.findIndex(
                (t) => t.value === value
              );
              const nextTimeOption = timeOptions[startIndex + 1];
              if (nextTimeOption) {
                updatedSlot.endTime = nextTimeOption.value;
              }
            }

            const validation = validateTimeSlot(
              updatedSlot.startTime,
              updatedSlot.endTime
            );
            updatedSlot.hasError = !validation.isValid;
            updatedSlot.errorMessage = validation.error;

            return updatedSlot;
          }
          return slot;
        }) || [],
    }));

    setHasUnsavedChanges(true);

    if (saveTimeoutRef.current[dateKey]) {
      clearTimeout(saveTimeoutRef.current[dateKey]);
    }
  };

  const handleDeleteSlot = async (
    dateKey: string,
    slotId: string
  ): Promise<void> => {
    const slot = dateSlots[dateKey]?.find((s) => s.id === slotId);
    if (!slot) return;

    try {
      setSaving(true);
      setError(null);

      // Parse dateKey in UTC
      const [year, month, day] = dateKey.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));

      console.log("Deleting slot for date:", date, "dateKey:", dateKey);
      console.log(
        "Date components for deletion - Year:",
        year,
        "Month:",
        month,
        "Day:",
        day
      );

      const startDateTime = createISODateTime(date, slot.startTime);
      const endDateTime = createISODateTime(date, slot.endTime);

      console.log("Delete request:", {
        startTime: startDateTime,
        endTime: endDateTime,
      });

      await AvailabilityService.deleteAvailabilityRange({
        startTime: startDateTime,
        endTime: endDateTime,
      });

      setDateSlots((prev) => {
        const updatedSlots = {
          ...prev,
          [dateKey]: prev[dateKey]?.filter((s) => s.id !== slotId) || [],
        };

        if (updatedSlots[dateKey].length === 0) {
          setSelectedDates((prevDates) =>
            prevDates.filter((d) => formatDateKey(d) !== dateKey)
          );
          delete updatedSlots[dateKey];
        }

        return updatedSlots;
      });

      setSuccessMessage("Time slot deleted successfully");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (error) {
      console.error("Failed to delete slot:", error);
      setError("Failed to delete time slot. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveAvailabilityForDate = async (dateKey: string): Promise<void> => {
    const slots = dateSlots[dateKey] || [];

    console.log("Saving availability for dateKey:", dateKey, "slots:", slots);
    console.log("DateKey breakdown:", dateKey.split("-"));

    const hasErrors = slots.some((slot) => slot.hasError);
    if (hasErrors) {
      console.log("Skipping save due to validation errors");
      return;
    }

    const hasModifiedSlots = slots.some((slot) => slot.isModified);
    if (!hasModifiedSlots && slots.length > 0) {
      console.log("No modified slots to save");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const timeRanges: TimeRange[] = slots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      console.log(`Saving availability for ${dateKey}:`, {
        date: dateKey,
        timeRanges,
      });
      console.log("Confirming dateKey format is correct:", dateKey);

      const result = await AvailabilityService.setDayAvailability({
        date: dateKey,
        timeRanges: timeRanges,
      });

      setDateSlots((prev) => ({
        ...prev,
        [dateKey]:
          prev[dateKey]?.map((slot) => ({ ...slot, isModified: false })) || [],
      }));

      setHasUnsavedChanges(false);

      // Create proper UTC date for display
      const [year, month, day] = dateKey.split("-").map(Number);
      const displayDate = new Date(Date.UTC(year, month - 1, day));

      setSuccessMessage(
        `Availability saved successfully for ${displayDate.toLocaleDateString(
          "en-US",
          {
            timeZone: "UTC",
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}`
      );
      setTimeout(() => setSuccessMessage(null), 2000);
      console.log("Availability saved successfully for", dateKey, result);
    } catch (error) {
      console.error("Failed to save availability:", error);
      setError("Failed to save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveAllChanges = async (): Promise<void> => {
    const datesToSave = Object.keys(dateSlots).filter((dateKey) =>
      dateSlots[dateKey].some((slot) => slot.isModified)
    );

    if (datesToSave.length === 0) {
      setSuccessMessage("No changes to save");
      setTimeout(() => setSuccessMessage(null), 2000);
      return;
    }

    for (const dateKey of datesToSave) {
      await saveAvailabilityForDate(dateKey);
    }
  };

  const calculateSlotCount = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    const totalMinutes = endTotalMinutes - startTotalMinutes;
    return Math.max(0, Math.floor(totalMinutes / 30));
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

      dates.forEach((date) => {
        const dateKey = formatDateKey(date);
        console.log("Processing selected date:", date, "as dateKey:", dateKey);
        if (!dateSlots[dateKey]) {
          setDateSlots((prev) => ({
            ...prev,
            [dateKey]: [],
          }));
        }
      });
    }
  };

  const getSelectedDates = (): Date[] => {
    console.log(selectedDates, "Selected dates for rendering");
    return selectedDates;
  };

  const dismissMessage = () => {
    setError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    return () => {
      Object.values(saveTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  if (loading) {
    return (
      <div className="px-0 sm:px-2 py-6 relative max-w-6xl">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your availability...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-0 sm:px-2 py-6 relative max-w-6xl">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 text-sm flex-1">{successMessage}</p>
            <button
              onClick={dismissMessage}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 text-sm flex-1">{error}</p>
            <button
              onClick={dismissMessage}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {hasUnsavedChanges && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800 text-sm">
                You have unsaved changes
              </p>
            </div>
            <button
              onClick={saveAllChanges}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 text-sm"
            >
              <Save className="w-4 h-4" />
              Save Now
            </button>
          </div>
        </div>
      )}

      {slotsData.length > 0 ? (
        <div className="w-full space-y-8">
          <div className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-left">
            Manage Your Slots
            {saving && (
              <span className="ml-3 text-sm font-normal text-blue-600 animate-pulse">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Saving changes...
                </div>
              </span>
            )}
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
                        console.log(selDate, "Selected date for rendering");
                        const dateKey = formatDateKey(selDate);
                        console.log(
                          dateKey,
                          "Formatted date key for rendering"
                        );
                        const slotsForDate = dateSlots[dateKey] || [];

                        console.log(
                          "Rendering date:",
                          selDate,
                          "dateKey:",
                          dateKey,
                          "slots:",
                          slotsForDate
                        );

                        return (
                          <div
                            key={`${dateKey}-${index}`}
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
                                className="flex items-center gap-1 px-3 py-2 md:py-1 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm cursor-pointer disabled:opacity-50"
                                onClick={() => handlePlusClick(selDate)}
                                disabled={saving}
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
                                    Click &quot;Add Slot&quot; to create your
                                    first time slot
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
                                      className={`bg-white rounded-lg border p-3 md:p-4 shadow-sm ${
                                        slot.hasError
                                          ? "border-red-300 bg-red-50"
                                          : slot.isModified
                                          ? "border-blue-300 bg-blue-50"
                                          : "border-black"
                                      }`}
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
                                            disabled={saving}
                                            className={`w-full sm:w-auto py-2 border rounded-md text-sm appearance-none pr-0 pl-3 sm:pr-2 cursor-pointer focus:outline-none focus:ring-2 disabled:opacity-50 ${
                                              slot.hasError
                                                ? "border-red-300 focus:ring-red-500"
                                                : slot.isModified
                                                ? "border-blue-300 focus:ring-blue-500"
                                                : "border-gray-300 focus:ring-black"
                                            }`}
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
                                            disabled={saving}
                                            className={`w-full sm:w-auto py-2 border rounded-md text-sm appearance-none pr-0 pl-3 sm:pr-2 cursor-pointer focus:outline-none focus:ring-2 disabled:opacity-50 ${
                                              slot.hasError
                                                ? "border-red-300 focus:ring-red-500"
                                                : slot.isModified
                                                ? "border-blue-300 focus:ring-blue-500"
                                                : "border-gray-300 focus:ring-black"
                                            }`}
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
                                          disabled={saving}
                                          className="p-2 text-black hover:bg-gray-100 rounded-md cursor-pointer disabled:opacity-50"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>

                                      {slot.hasError && slot.errorMessage && (
                                        <div className="mb-2 p-2 bg-red-100 border border-red-200 rounded text-xs text-red-700 flex items-center">
                                          <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                                          {slot.errorMessage}
                                        </div>
                                      )}

                                      {slotCount > 0 && !slot.hasError && (
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
