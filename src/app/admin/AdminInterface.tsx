"use client";

import React, { useEffect, useState } from "react";
import MetricCard from "../overviewComponents/MetricCard";
import PieChartComponent from "../overviewComponents/PieChartComponent";
import BarChartComponent from "../overviewComponents/BarChartComponent";

const AdminOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const metrics = [
    {
      title: "Total Interviewers",
      value: 10,
      subtitle: "Active interviewers",
    },
    {
      title: "Total Interviewees",
      value: 12,
      subtitle: "Registered candidates",
    },
    {
      title: "Total Slots",
      value: 72,
      subtitle: "Combined slot count",
    },
    {
      title: "Booking Rate",
      value: "67%",
      subtitle: "Utilization percentage",
    },
  ];

  const pieCharts = [
    {
      title: "Slot Utilization",
      data: [
        { name: "Booked", value: 48 },
        { name: "Available", value: 24 },
      ],
    },
    {
      title: "Interviewee Booking Status",
      data: [
        { name: "Not Booked", value: 2 },
        { name: "Booked", value: 10 },
      ],
    },
  ];

  const barChartData = [
    { name: "Mon", interviews: 6 },
    { name: "Tue", interviews: 8 },
    { name: "Wed", interviews: 5 },
    { name: "Thu", interviews: 9 },
    { name: "Fri", interviews: 7 },
    { name: "Sat", interviews: 3 },
    { name: "Sun", interviews: 2 },
  ];

  const transformedData = barChartData.map((item) => ({
    category: item.name,
    value: item.interviews,
  }));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {pieCharts.map((chart, index) => (
            <PieChartComponent
              key={index}
              data={chart.data}
              title={chart.title}
            />
          ))}
        </div>

        <div className="mb-8">
          <BarChartComponent
            data={transformedData}
            title="Weekly Interview Trends"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
