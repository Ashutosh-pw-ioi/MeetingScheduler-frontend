import React from 'react';

interface ShimmerLoaderProps {
  rows?: number;
}

export default function ShimmerLoader({ rows = 5 }: ShimmerLoaderProps) {
  return (
    <div className="bg-white shadow rounded-sm overflow-hidden border">
      {/* Header shimmer */}
      <div className="p-4 border-b">
        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Search bar shimmer */}
      <div className="p-4 border-b">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Table shimmer */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {/* Table headers shimmer */}
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-5">
                    <div className="flex items-center space-x-3">
                      {colIndex === 0 ? (
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      ) : colIndex === 1 ? (
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      ) : colIndex === 2 || colIndex === 3 ? (
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      ) : (
                        <div className="flex space-x-2">
                          <div className="h-8 w-8 bg-gray-200 rounded"></div>
                          <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        </div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination shimmer */}
      <div className="p-4 flex justify-between items-center border-t bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
