// Table/SimpleTable.tsx - Updated with hyperlink field support
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, ExternalLink } from "lucide-react";

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
  hyperlinkFields?: string[]; // New prop for hyperlink fields
  onCellClick?: (row: TableItem, columnKey: string) => void;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  data,
  itemsPerPage = 5,
  badgeFields = [],
  searchFields = [],
  hyperlinkFields = [], // New prop
  onCellClick,
}) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    
    // Generate columns but replace 'id' with 'displayId' and hide actual 'id'
    return Object.keys(data[0])
      .filter(key => key !== 'id') // Hide the UUID id field
      .map((key) => ({
        key: key === 'displayId' ? 'displayId' : key,
        label: key === 'displayId' ? 'ID' : key.charAt(0).toUpperCase() + key.slice(1),
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

  // Helper function to render hyperlink
  const renderHyperlink = (url: string, text?: string) => {
    if (!url || url === 'N/A' || url === '' || url === 'null' || url === 'undefined') {
      return (
        <span className="text-gray-400 text-sm italic">
          No link available
        </span>
      );
    }

    // Ensure URL has protocol
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const displayText = text || 'Open Link';

    return (
      <a
        href={formattedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-sm group"
        onClick={(e) => e.stopPropagation()} // Prevent row click
      >
        <span>{displayText}</span>
        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
      </a>
    );
  };

  const renderCell = (item: TableItem, column: TableColumn) => {
    if (column.render) return column.render(item);

    const value = item[column.key];

    // Handle hyperlink fields
    if (hyperlinkFields.includes(column.key)) {
      // Check if it's a JSX element (already rendered hyperlink)
      if (React.isValidElement(value)) {
        return value;
      }
      // Otherwise render as hyperlink
      return renderHyperlink(value);
    }

    // Handle badge fields
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
            className="pl-10 pr-4 py-2 border rounded-lg w-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="text-left px-4 py-3 font-medium text-gray-700 text-sm"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((item, idx) => (
              <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-5 text-gray-600 ${
                      hyperlinkFields.includes(column.key) ? '' : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      // Don't trigger onCellClick for hyperlink fields
                      if (!hyperlinkFields.includes(column.key)) {
                        onCellClick?.(item, column.key);
                      }
                    }}
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
                  className="text-center py-8 text-gray-500 text-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-8 h-8 text-gray-300" />
                    <span>No results found</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > itemsPerPage && (
        <div className="p-4 flex justify-between items-center border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} results
          </p>
          <div className="flex space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
            </span>
            <button
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors text-sm font-medium"
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
