"use client";

import React from "react";
import MetricCard from "../overviewComponents/MetricCard";
import PieChartComponent from "../overviewComponents/PieChartComponent";
import BarChartComponent from "../overviewComponents/BarChartComponent";
import { useDashboardData } from "../../hooks/useDashboardData"

const AdminOverview: React.FC = () => {
  const { dashboardData, transformedBarData, loading, error, refetch } = useDashboardData();

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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Overview
          </h1>
          <p className="text-gray-600 mt-2">
            System-wide interview insights and stats
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {dashboardData.metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {dashboardData.pieCharts.map((chart, index) => (
            <PieChartComponent
              key={index}
              data={chart.data}
              title={chart.title}
            />
          ))}
        </div>

        <div className="mb-8">
          <BarChartComponent
            data={transformedBarData}
            title="Weekly Interview Trends"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
