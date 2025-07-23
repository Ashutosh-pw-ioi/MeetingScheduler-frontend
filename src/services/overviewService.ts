import { api } from '@/lib/api';
import { TodaySummary, WeeklyTrendsResponse } from '@/types/overview';
import { CategorizedMeetings } from '../types/meeting';

export class OverviewService {
  static async getTodaySummary(): Promise<TodaySummary> {
    try {
      console.log('Fetching today summary from API...');
      const response = await api.get<TodaySummary>('/api/availability/summary/today');
      console.log('Today summary data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch today summary:', error);
      throw new Error('Failed to fetch today summary data');
    }
  }

  static async getWeeklyTrends(): Promise<WeeklyTrendsResponse> {
    try {
      console.log('Fetching weekly booking trends from API...');
      const response = await api.get<WeeklyTrendsResponse>('/api/availability/getAllBookedCountsWeekly');
      console.log('Weekly trends data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch weekly trends:', error);
      throw new Error('Failed to fetch weekly trends data');
    }
  }

  static async getAllMeetings(): Promise<CategorizedMeetings> {
    try {
      console.log('Fetching all meetings from API...');
      const response = await api.get<CategorizedMeetings>('/api/availability/allMeetings');
      console.log('All meetings data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
      throw new Error('Failed to fetch meetings data');
    }
  }

  static calculateMetrics(todaySummary: TodaySummary) {
    const totalSlots = todaySummary.bookedSlots + todaySummary.availableSlots;
    const bookingRate = totalSlots > 0 ? Math.round((todaySummary.bookedSlots / totalSlots) * 100) : 0;

    return [
      {
        title: "Total Meetings",
        value: todaySummary.bookedSlots,
        subtitle: "Scheduled interviews",
      },
      {
        title: "Total Slots Created",
        value: totalSlots,
        subtitle: "Available time slots",
      },
      {
        title: "Available Slots",
        value: todaySummary.availableSlots,
        subtitle: "Remaining open slots",
      },
      {
        title: "Booking Rate",
        value: `${bookingRate}%`,
        subtitle: "Slots filled rate",
      },
    ];
  }

  static calculateMeetingDistribution(meetings: CategorizedMeetings) {
    return [
      { name: "Past", value: meetings.past.length },
      { name: "Today", value: meetings.todays.length },
      { name: "Upcoming", value: meetings.upcoming.length },
    ];
  }

  static calculateSlotStatus(todaySummary: TodaySummary) {
    return [
      { name: "Booked", value: todaySummary.bookedSlots },
      { name: "Available", value: todaySummary.availableSlots },
    ];
  }
}
