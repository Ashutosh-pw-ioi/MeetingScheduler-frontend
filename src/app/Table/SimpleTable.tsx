"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  ExternalLink,
  Edit,
  Trash2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

export interface TableColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

export type TableItem<T = any> = T;

interface SimpleTableProps<T extends Record<string, any>> {
  data: T[];
  itemsPerPage?: number;
  badgeFields?: string[];
  searchFields?: string[];
  hyperlinkFields?: string[];
  onCellClick?: (row: T, columnKey: string) => void;
  onEdit?: (updatedRow: T) => void;
  onDelete?: (id: T["id"]) => void;
  title?: string;
}

const SimpleTable = <T extends Record<string, any>>({
  data,
  itemsPerPage = 10,
  badgeFields = [],
  searchFields = [],
  hyperlinkFields = [],
  onCellClick,
  onEdit,
  onDelete,
  title,
}: SimpleTableProps<T>) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0])
      .filter((key) => key !== "id")
      .map((key) => ({
        key: key === "displayId" ? "displayId" : key,
        label:
          key === "displayId"
            ? "ID"
            : key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1"),
      }));
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [rowToDelete, setRowToDelete] = useState<T | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredData(data);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const newData = data.filter((item) =>
        searchFields.length > 0
          ? searchFields.some((field) =>
              String(item[field as keyof T] ?? "")
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

  const renderHyperlink = (url: string, text?: string) => {
    if (
      !url ||
      url === "N/A" ||
      url === "" ||
      url === "null" ||
      url === "undefined"
    ) {
      return (
        <span className="text-gray-400 text-sm italic">No link available</span>
      );
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    const displayText = text || "Open Link";

    return (
      <a
        href={formattedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-sm group"
        onClick={(e) => e.stopPropagation()}
      >
        <span>{displayText}</span>
        <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-transform" />
      </a>
    );
  };

  const renderCell = (item: T, column: TableColumn) => {
    if (column.render) return column.render(item);

    const value = item[column.key as keyof T];

    if (hyperlinkFields.includes(column.key)) {
      if (React.isValidElement(value)) {
        return value;
      }
      return renderHyperlink(value as string);
    }

    if (column.key === "status") {
      const isScheduled = value === "Interview Scheduled";
      return (
        <span
          className={`inline-block px-4 py-1 text-xs rounded-md font-medium border ${
            isScheduled
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {String(value) || "Unknown"}
        </span>
      );
    }

    // 👇 Department-specific colors
    if (column.key === "department") {
      const departmentColors = {
        SOT: "bg-blue-100 text-blue-800 border-blue-200",       // School of Technology = Blue
        SOM: "bg-purple-100 text-purple-800 border-purple-200", // School of Management = Purple
        GENERAL: "bg-gray-100 text-gray-800 border-gray-200"     // General = Gray
      };
      
      const colorClass = departmentColors[value as keyof typeof departmentColors] || departmentColors.GENERAL;
      
      return (
        <span className={`inline-block px-4 py-1 text-xs rounded-md font-medium border ${colorClass}`}>
          {String(value)}
        </span>
      );
    }

    if (badgeFields.includes(column.key)) {
      return (
        <span className="inline-block px-4 py-1 text-xs rounded-md bg-gray-200 text-gray-800">
          {String(value)}
        </span>
      );
    }

    return String(value ?? "");
  };

  const handleEditClick = (row: T) => {
    setEditingRow({ ...row });
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingRow) return;
    const { name, value } = e.target;

    let processedValue = value;
    if (!isNaN(Number(value)) && value.trim() !== "") {
      processedValue = value;
    }

    setEditingRow({
      ...editingRow,
      [name]: processedValue,
    });
  };

  const handleSaveEdit = () => {
    if (!editingRow || !onEdit) return;

    onEdit(editingRow);
    setEditModalOpen(false);
    setEditingRow(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingRow(null);
  };

  const handleDeleteClick = (row: T) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!rowToDelete || !onDelete) return;

    onDelete(rowToDelete.id as T["id"]);
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  return (
    <div className="bg-white shadow rounded-sm overflow-hidden border">
      {title && (
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}

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
                  className="text-left px-4 py-3 font-medium text-gray-700 text-sm whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-left px-4 py-3 font-medium text-gray-700 text-sm whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((item, idx) => (
              <tr
                key={item.id || idx}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-5 text-gray-600 ${
                      hyperlinkFields.includes(column.key)
                        ? ""
                        : "cursor-pointer"
                    } whitespace-nowrap`}
                    onClick={() => {
                      if (!hyperlinkFields.includes(column.key)) {
                        onCellClick?.(item, column.key);
                      }
                    }}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-5 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(item);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(item);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
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
              Page {currentPage} of{" "}
              {Math.ceil(filteredData.length / itemsPerPage)}
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

      {/* EDIT MODAL */}
      {editModalOpen && editingRow && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeEditModal}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800">Edit Record</h3>
              <button
                onClick={closeEditModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {columns.map((column) => (
                  <div key={column.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {column.label}
                      {column.key === "status" && (
                        <span className="text-xs text-gray-500 ml-2">(Read-only)</span>
                      )}
                    </label>
                    {column.key === "department" ? (
                      <select
                        name={column.key}
                        value={editingRow[column.key as keyof T] ?? ""}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="SOT">SOT - School of Technology</option>
                        <option value="SOM">SOM - School of Management</option>
                        <option value="GENERAL">GENERAL</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={column.key}
                        value={editingRow[column.key as keyof T] ?? ""}
                        onChange={handleEditChange}
                        disabled={column.key === "status"}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          column.key === "status" 
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : ""
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-5 border-t bg-gray-50">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModalOpen && rowToDelete && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeDeleteModal}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-center text-gray-800 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-center text-gray-600 mb-6">
              Are you sure you want to delete this record? This action cannot be
              undone.
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTable;
