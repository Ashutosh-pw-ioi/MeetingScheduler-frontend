// src/types/dashboard.types.ts

export interface MetricData {
  title: string;
  value: number | string;
  subtitle: string;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
}

export interface PieChartData {
  title: string;
  data: PieChartDataPoint[];
}

export interface BarChartDataPoint {
  name: string;
  interviews: number;
}

export interface DailyBreakdown {
  date: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  bookingRate: string;
}

export interface DashboardResponse {
  metrics: MetricData[];
  pieCharts: PieChartData[];
  barChartData: BarChartDataPoint[];
  dailyBreakdown?: {
    today: DailyBreakdown;
    tomorrow: DailyBreakdown;
    dayAfterTomorrow: DailyBreakdown;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

export interface TransformedBarData {
  category: string;
  value: number;
}
