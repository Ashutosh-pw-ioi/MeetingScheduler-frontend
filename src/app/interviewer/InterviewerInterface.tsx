"use client";

import React, { useState, useEffect } from "react";
import MetricCard from "../overviewComponents/MetricCard";
import PieChartComponent from "../overviewComponents/PieChartComponent";
import WeeklyTrendChart from "../overviewComponents/WeeklyTrendChart";

const InterviewerInterface: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const metrics = [
    {
      title: "Total Meetings",
      value: 48,
      subtitle: "Scheduled interviews",
    },
    {
      title: "Total Slots Created",
      value: 72,
      subtitle: "Available time slots",
    },
    {
      title: "Available Slots",
      value: 24,
      subtitle: "Remaining open slots",
    },
    {
      title: "Booking Rate",
      value: "67%",
      subtitle: "Slots filled rate",
    },
  ];

  const meetingDistributionData = [
    { name: "Past", value: 12 },
    { name: "Today", value: 8 },
    { name: "Upcoming", value: 28 },
  ];

  const slotStatusData = [
    { name: "Booked", value: 48 },
    { name: "Available", value: 24 },
  ];

  const weeklyTrendsData = [
    { day: "Mon", interviews: 6 },
    { day: "Tue", interviews: 8 },
    { day: "Wed", interviews: 5 },
    { day: "Thu", interviews: 9 },
    { day: "Fri", interviews: 7 },
    { day: "Sat", interviews: 3 },
    { day: "Sun", interviews: 2 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
            onClick={() => window.location.reload()}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Interviewer Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Track your interview slots and meeting insights
          </p>
        </div>

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
