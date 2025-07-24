export interface TodaySummary {
  date: string;
  bookedSlots: number;
  availableSlots: number;
}

export interface WeeklyTrendData {
  day: string;
  interviews: number;
  fullDay: string;
}

export interface WeekInfo {
  weekStart: string;
  weekEnd: string;
  weekNumber: number;
  year: number;
  totalBookings: number;
}

export interface WeeklySummary {
  totalInterviews: number;
  averagePerDay: number;
  mostActiveDay: WeeklyTrendData;
  leastActiveDay: WeeklyTrendData;
}

export interface WeeklyTrendsResponse {
  weeklyTrends: WeeklyTrendData[];
  weekInfo: WeekInfo;
  summary: WeeklySummary;
}

export interface MetricData {
  title: string;
  value: string | number;
  subtitle: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface OverviewData {
  metrics: MetricData[];
  meetingDistribution: ChartData[];
  slotStatus: ChartData[];
  weeklyTrends: WeeklyTrendData[];
}
