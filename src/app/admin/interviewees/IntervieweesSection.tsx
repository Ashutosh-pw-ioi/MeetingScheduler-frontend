"use client";

import React, { useState, useEffect } from "react";
import SimpleTable from "../../Table/SimpleTable";
import EmptyList from "@/app/interviewer/EmptyList";
import {
  UserRound,
  CalendarDays,
  Clock,
  Link2,
  X as CloseIcon,
} from "lucide-react";
import { useIntervieweeData } from "../../../hooks/useInterviewee";
import { Interviewee, IntervieweeTableData } from "../../../types/adminInterviewees.types";

// DetailsModal Component (Kept inside IntervieweesSection)
function DetailsModal({
  interviewee,
  isOpen,
  onClose,
}: {
  interviewee: Interviewee | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !interviewee || !interviewee.details) return null;

  const { details } = interviewee;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-md flex items-center justify-center z-50 shadow-2xl">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Meeting Details for {interviewee.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Close modal"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 text-gray-700">
          <div className="flex items-start gap-3">
            <UserRound className="mt-1" size={20} />
            <div>
              <strong>Interviewer:</strong>
              <p>{details.interviewerName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-1" size={20} />
            <div>
              <strong>Date:</strong>
              <p>{details.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-1" size={20} />
            <div>
              <strong>Time:</strong>
              <p>{details.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Link2 className="mt-1" size={20} />
            <div>
              <strong>Meeting Link:</strong>
              <p>
                <a
                  href={details.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-700 hover:text-blue-900 break-all"
                >
                  {details.meetingLink}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main IntervieweesSection Component
export default function IntervieweesSection() {
  const { intervieweesData, tableData, loading, error, refetch } = useIntervieweeData();
  const [selectedInterviewee, setSelectedInterviewee] = useState<Interviewee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (row: IntervieweeTableData) => {
    const fullData = intervieweesData.find((d) => d.email === row.email);
    if (fullData && fullData.slotBooked && fullData.details) {
      setSelectedInterviewee(fullData);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedInterviewee(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) closeModal();
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 relative">
        <div className="text-3xl font-bold mb-8">Interviewees Management</div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interviewees...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 relative">
        <div className="text-3xl font-bold mb-8">Interviewees Management</div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refetch}
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
      {intervieweesData.length > 0 ? (
        <div className="w-full">
          <div className="text-3xl font-bold mb-8">Interviewees Management</div>

          <SimpleTable
            data={tableData}
            searchFields={["name", "email"]}
            itemsPerPage={5}
            badgeFields={["slotBooked"]}
            onCellClick={(row, column) => {
              if (column === "details")
                handleViewDetails(row as IntervieweeTableData);
            }}
          />
        </div>
      ) : (
        <div className="h-screen">
          <EmptyList taskType="interviewees" />
        </div>
      )}

      <DetailsModal
        interviewee={selectedInterviewee}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
