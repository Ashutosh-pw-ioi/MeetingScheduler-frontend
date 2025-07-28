"use client";

import React, { useState, useEffect } from "react";
import EmptyList from "@/app/interviewer-D9C75C81F03C9AA4/EmptyList";
import SimpleTable from "../../Table/SimpleTable";

interface OperationData {
  applicationId: string;
  phone:string;
  interviewer: string;
  interviewDate: string;
}

interface OperationTableData {
  applicationId: string;
  phone:string;
  interviewer: string;
  date: string;
}

export default function OperationsSection() {
  const [operationsData, setOperationsData] = useState<OperationData[]>([]);
  const [tableData, setTableData] = useState<OperationTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("");

  // Fetch operations data
  const fetchOperationsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/admin/getapplicationid`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      setOperationsData(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Format date to Indian format (DD/MM/YYYY)
  const formatToIndianDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Transform data for table
  useEffect(() => {
    let filteredData = operationsData;

    // Apply date filter if selected
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filteredData = operationsData.filter(item => {
        const itemDate = new Date(item.interviewDate);
        return (
          itemDate.getDate() === filterDate.getDate() &&
          itemDate.getMonth() === filterDate.getMonth() &&
          itemDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    const transformedData: OperationTableData[] = filteredData.map(item => ({
      applicationId: item.applicationId,
      phone:item.phone,
      interviewer: item.interviewer,
      date: formatToIndianDate(item.interviewDate),
    }));

    setTableData(transformedData);
  }, [operationsData, dateFilter]);

  // Fetch data on component mount
  useEffect(() => {
    fetchOperationsData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 relative">
        <div className="text-3xl font-bold mb-8">Operations Management</div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading operations data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 relative">
        <div className="text-3xl font-bold mb-8">Operations Management</div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOperationsData}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 relative">
      {operationsData.length > 0 ? (
        <div className="w-full">
          <div className="text-3xl font-bold mb-8">Operations</div>

          {/* Date Filter */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700">
                Filter by Date:
              </label>
              <input
                id="dateFilter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter("")}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          <div className="operations-table">
            <SimpleTable
              data={tableData}
              searchFields={["applicationId", "interviewer"]}
              itemsPerPage={10}
              onCellClick={(row, column) => {
                // Handle cell click if needed
                console.log("Clicked:", row, column);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-screen">
          <EmptyList taskType="operations" />
        </div>
      )}
    </div>
  );
}
