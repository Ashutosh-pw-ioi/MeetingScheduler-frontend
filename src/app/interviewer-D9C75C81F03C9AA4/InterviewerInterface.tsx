"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AuthService } from "@/services/authService";
import { OverviewService } from "@/services/overviewService";
import { CalendarStatus } from "@/types/auth";
import { MetricData, ChartData, WeeklyTrendData } from "../../types/overview";
import MetricCard from "../overviewComponents/MetricCard";
import PieChartComponent from "../overviewComponents/PieChartComponent";
import WeeklyTrendChart from "../overviewComponents/WeeklyTrendChart";
import { AlertCircle, RefreshCw } from "lucide-react";

const InterviewerInterface: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [calendarStatus, setCalendarStatus] = useState<CalendarStatus | null>(
    null
  );
  const [showCalendarSuccess, setShowCalendarSuccess] =
    useState<boolean>(false);

  // Data states
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [meetingDistributionData, setMeetingDistributionData] = useState<
    ChartData[]
  >([]);
  const [slotStatusData, setSlotStatusData] = useState<ChartData[]>([]);
  const [weeklyTrendsData, setWeeklyTrendsData] = useState<WeeklyTrendData[]>(
    []
  );

  const hasInitialized = useRef(false);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadOverviewData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      console.log("Loading overview data...");

      // Fetch all data in parallel
      const [todaySummary, weeklyTrends, allMeetings] = await Promise.all([
        OverviewService.getTodaySummary(),
        OverviewService.getWeeklyTrends(),
        OverviewService.getAllMeetings(),
      ]);

      console.log("All overview data fetched:", {
        todaySummary,
        weeklyTrends,
        allMeetings,
      });

      // Calculate metrics from today's summary
      const calculatedMetrics = OverviewService.calculateMetrics(todaySummary);
      setMetrics(calculatedMetrics);

      // Calculate meeting distribution from all meetings
      const meetingDistribution =
        OverviewService.calculateMeetingDistribution(allMeetings);
      setMeetingDistributionData(meetingDistribution);

      // Calculate slot status from today's summary
      const slotStatus = OverviewService.calculateSlotStatus(todaySummary);
      setSlotStatusData(slotStatus);

      // Set weekly trends data
      setWeeklyTrendsData(weeklyTrends.weeklyTrends);

      console.log("Overview data processed and set to state");
    } catch (error) {
      console.error("Failed to load overview data:", error);
      setError("Failed to load dashboard data. Please try again.");
    }
  }, []);

  const initializeData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      // Check calendar status
      const calendarData = await AuthService.checkCalendarStatus();
      console.log("Calendar status:", calendarData);
      setCalendarStatus(calendarData);

      // Show success message if calendar is connected
      if (calendarData && calendarData.hasCalendarAccess) {
        setShowCalendarSuccess(true);
        successTimeoutRef.current = setTimeout(() => {
          setShowCalendarSuccess(false);
        }, 3000); // Hide after 3 seconds
      }

      // Load overview data
      await loadOverviewData();
    } catch (err) {
      console.error("Failed to initialize data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadOverviewData]);

  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    initializeData();
  }, [initializeData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadOverviewData();
    setRefreshing(false);
  };

  const handleConnectCalendar = (): void => {
    const calendarAuthUrl = AuthService.getCalendarAuthUrl();
    window.location.href = calendarAuthUrl;
  };

  const handleRetry = (): void => {
    setError(null);
    setLoading(true);
    hasInitialized.current = false;
    initializeData();
  };

  const handleDismissSuccess = (): void => {
    setShowCalendarSuccess(false);
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Interviewer Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Track your interview slots and meeting insights
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="text-red-600 hover:text-red-800"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Calendar Connection Status - Warning for not connected */}
        {calendarStatus && !calendarStatus.hasCalendarAccess && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-yellow-800 font-medium">
                    Calendar Not Connected
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Connect your Google Calendar to enable interview scheduling
                  </p>
                  {calendarStatus.error && (
                    <p className="text-yellow-700 text-xs mt-1">
                      {calendarStatus.error}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleConnectCalendar}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Connect Calendar
              </button>
            </div>
          </div>
        )}

        {/* Success message for calendar connection - Shows for 3 seconds only */}
        {showCalendarSuccess &&
          calendarStatus &&
          calendarStatus.hasCalendarAccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-green-800 font-medium">
                      Calendar Connected Successfully
                    </p>
                    <p className="text-green-700 text-sm">
                      Your Google Calendar is connected and ready for scheduling
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismissSuccess}
                  className="text-green-600 hover:text-green-800 transition-colors"
                  aria-label="Dismiss"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PieChartComponent
            data={meetingDistributionData}
            title="Meeting Distribution by Time"
          />
          <PieChartComponent
            data={slotStatusData}
            title="Slot Status Distribution"
          />
        </div>

        <div className="mb-8">
          <WeeklyTrendChart
            data={weeklyTrendsData}
            title="Weekly Interview Trends"
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewerInterface;
