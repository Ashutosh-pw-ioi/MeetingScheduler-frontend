"use client";

import React, { useState } from "react";
import EmptyList from "@/app/interviewer-D9C75C81F03C9AA4/EmptyList";
import SimpleTable from "../../Table/SimpleTable";
import { CalendarOff } from "lucide-react";
import { useInterviewerData } from "../../../hooks/useInterviewerData";
import { Interviewer, InterviewerTableData } from "../../../types/adminInterviewer";

// MeetingsModal Component (Kept inside InterviewersSection)
function MeetingsModal({
  interviewer,
  isOpen,
  onClose,
}: {
  interviewer: Interviewer | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !interviewer) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-md flex items-center justify-center z-50 shadow-2xl">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Meetings for {interviewer.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <strong>Email:</strong>
              <p className="text-gray-700">{interviewer.email}</p>
            </div>
            <div className="pl-10">
              <strong>Total Slots:</strong>
              <p className="text-gray-700">{interviewer.totalSlots}</p>
            </div>
            <div>
              <strong>Booked Slots:</strong>
              <p className="text-gray-700">{interviewer.bookedSlots}</p>
            </div>
            <div>
              <strong>Available Slots:</strong>
              <p className="text-green-600 font-semibold">
                {interviewer.availableSlots}
              </p>
            </div>
          </div>
        </div>

        {interviewer.meetings.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Scheduled Meetings ({interviewer.meetings.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Interviewee Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Time
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                      Meeting Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interviewer.meetings.map((meeting, index) => (
                    <tr
                      key={`${meeting.intervieweeEmail}-${meeting.date}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        {meeting.intervieweeName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 border-b">
                        {meeting.intervieweeEmail}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        {new Date(meeting.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">
                        {meeting.time}
                      </td>
                      <td className="px-4 py-3 text-sm border-b">
                        <a
                          href={meeting.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          Meeting Link
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4 flex justify-center w-full">
              <CalendarOff className="w-20 h-20"/>
            </div>
            <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
            <p className="text-sm">
              This interviewer doesn&lsquo;t have any upcoming meetings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Main InterviewersSection Component
export default function InterviewersSection() {
  const { interviewersData, tableData, loading, error, refetch } = useInterviewerData();
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewMeetings = (row: InterviewerTableData) => {
    const fullData = interviewersData.find((d) => d.id === row.id);
    if (fullData) {
      setSelectedInterviewer(fullData);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedInterviewer(null);
    setIsModalOpen(false);
  };

  React.useEffect(() => {
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
        <div className="text-3xl font-bold mb-8">Interviewers Management</div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interviewers...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 relative">
        <div className="text-3xl font-bold mb-8">Interviewers Management</div>
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
      {interviewersData.length > 0 ? (
        <div className="w-full">
          <div className="text-3xl font-bold mb-8">Interviewers Management</div>

          <div className="interviewer-table">
            <SimpleTable
              data={tableData}
              searchFields={["name", "email"]}
              itemsPerPage={5}
              badgeFields={["availableSlots"]}
              onCellClick={(row, column) => {
                if (column === "meetings")
                  handleViewMeetings(row as InterviewerTableData);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="h-screen">
          <EmptyList taskType="interviewers" />
        </div>
      )}

      <MeetingsModal
        interviewer={selectedInterviewer}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
