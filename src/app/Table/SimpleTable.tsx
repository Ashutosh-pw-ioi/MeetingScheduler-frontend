"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";

export interface TableColumn {
  key: string;
  label: string;
  render?: (row: TableItem) => React.ReactNode;
}

export interface TableItem {
  [key: string]: any;
}

interface SimpleTableProps {
  data: TableItem[];
  itemsPerPage?: number;
  badgeFields?: string[];
  searchFields?: string[];
  onCellClick?: (row: TableItem, columnKey: string) => void;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  data,
  itemsPerPage = 5,
  badgeFields = [],
  searchFields = [],
  onCellClick,
}) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }));
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const newData = data.filter((item) =>
        searchFields.length > 0
          ? searchFields.some((field) =>
              String(item[field] ?? "")
                .toLowerCase()
                .includes(lowerQuery)
            )
          : Object.values(item).some((value) =>
              String(value ?? "")
                .toLowerCase()
                .includes(lowerQuery)
            )
      );
      setFilteredData(newData);
    }
    setCurrentPage(1);
  }, [searchQuery, data, searchFields]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const renderCell = (item: TableItem, column: TableColumn) => {
    if (column.render) return column.render(item);

    const value = item[column.key];

    if (badgeFields.includes(column.key)) {
      return (
        <span className="inline-block px-4 py-1 text-xs rounded-md bg-gray-200">
          {value}
        </span>
      );
    }

    return String(value ?? "");
  };

  return (
    <div className="bg-white shadow rounded-sm overflow-hidden border">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm text-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-4 py-3 font-medium text-gray-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-5 text-gray-600 cursor-pointer"
                    onClick={() => onCellClick?.(item, column.key)}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > itemsPerPage && (
        <div className="p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Page {currentPage} of{" "}
            {Math.ceil(filteredData.length / itemsPerPage)}
          </p>
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-[#1B3A6A] text-white"
            >
              Previous
            </button>
            <button
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-[#1B3A6A] text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTable;
