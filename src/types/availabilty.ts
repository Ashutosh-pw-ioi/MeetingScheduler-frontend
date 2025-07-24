export interface TimeRange {
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
}

export interface DailyAvailability {
  date: string; // YYYY-MM-DD format
  timeRanges: TimeRange[];
}

export interface AvailabilityResponse {
  date: string;
  timeRanges: TimeRange[];
}

export interface BatchSetAvailabilityRequest {
  availabilities: DailyAvailability[];
}

export interface DayAvailabilityRequest {
  date: string;
  timeRanges: TimeRange[];
}

export interface DeleteRangeRequest {
  startTime: string; // ISO string
  endTime: string;   // ISO string
}

export interface AvailabilityApiResponse {
  message: string;
  slotsCreated?: number;
}
