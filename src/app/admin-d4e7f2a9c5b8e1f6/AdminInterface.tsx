// src/components/AdminOverview.tsx

"use client";

import React, { useState, useMemo } from 'react';
import MetricCard from '../overviewComponents/MetricCard';
import PieChartComponent from '../overviewComponents/PieChartComponent';
import BarChartComponent from '../overviewComponents/BarChartComponent';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DailyBreakdown } from '../../types/adminDashboard';

interface DailyDataWithKey extends DailyBreakdown {
  key: string;
}

const AdminOverview: React.FC = () => {
  const { dashboardData, transformedBarData, loading, error, refetch } = useDashboardData();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const dailyArray: DailyDataWithKey[] = useMemo(() => {
    if (!dashboardData?.dailyBreakdown) return [];
    return Object.entries(dashboardData.dailyBreakdown).map(([key, value]) => ({
      key,
      ...value,
    }));
  }, [dashboardData]);

  const allDates = dailyArray.map(d => d.date);

  const selectedDayData = selectedDate
    ? dailyArray.find(d => d.date === selectedDate)
    : undefined;

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin insights...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Failed to load dashboard data'}</p>
          <button
            onClick={refetch}
            className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p className="text-gray-600 mt-2">System-wide interview insights and stats</p>
        </div>

        {/* Row 1: Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {dashboardData.metrics.map((metric, idx) => (
            <MetricCard
              key={idx}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        {/* Row 2: Breakdown Section with Date Filter */}
        <section className="bg-white rounded shadow p-5 flex flex-col justify-between mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {selectedDayData ? `Daily Breakdown for ${selectedDayData.date}` : '3-day Breakdown'}
            </h3>
            <div>
              <select
                id="dashboard-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-400 rounded px-2 py-1"
              >
                <option value="">All (3 days)</option>
                {allDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="ml-2 px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {selectedDayData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>Total Slots: {selectedDayData.totalSlots}</div>
              <div>Booked Slots: {selectedDayData.bookedSlots}</div>
              <div>Available Slots: {selectedDayData.availableSlots}</div>
              <div>Booking Rate: {selectedDayData.bookingRate}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dailyArray.map((day) => (
                <div
                  key={day.key}
                  className="bg-gray-50 rounded-lg p-4 border flex flex-col"
                >
                  <span className="font-semibold capitalize text-gray-800 mb-1">{day.date}</span>
                  <span>Total Slots: {day.totalSlots}</span>
                  <span>Booked Slots: {day.bookedSlots}</span>
                  <span>Available Slots: {day.availableSlots}</span>
                  <span>Booking Rate: {day.bookingRate}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Row 3: Pie Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {dashboardData.pieCharts.map((chart, idx) => (
            <PieChartComponent
              key={idx}
              data={chart.data}
              title={chart.title}
            />
          ))}
        </div>

        {/* Row 4: Bar Chart */}
        <div className="mb-8">
          <BarChartComponent
            data={transformedBarData}
            title={"Interview Trends"}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
