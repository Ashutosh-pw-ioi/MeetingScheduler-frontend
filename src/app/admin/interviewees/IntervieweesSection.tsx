"use client";

import React, { useState, useEffect } from "react";
import { intervieweesData } from "../constants/IntervieweesData";
import SimpleTable from "../../Table/SimpleTable";
import EmptyList from "@/app/interviewer/EmptyList";
import {
  UserRound,
  CalendarDays,
  Clock,
  Link2,
  X as CloseIcon,
} from "lucide-react";

interface Interviewee {
  name: string;
  email: string;
  phone: string;
  slotBooked: boolean;
  details: {
    interviewerName: string;
    date: string;
    time: string;
    meetingLink: string;
  };
}

interface IntervieweeTableData {
  sno: number;
  name: string;
  email: string;
  phone: string;
  slotBooked: string;
  details: string;
}

function DetailsModal({
  interviewee,
  isOpen,
  onClose,
}: {
  interviewee: Interviewee | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !interviewee) return null;

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

export default function IntervieweesSection() {
  const [selectedInterviewee, setSelectedInterviewee] =
    useState<Interviewee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableData: IntervieweeTableData[] = intervieweesData.map(
    (i, index) => ({
      sno: index + 1,
      name: i.name,
      email: i.email,
      phone: i.phone,
      slotBooked: i.slotBooked ? "Booked" : "Not Booked",
      details: i.slotBooked ? "View" : "-",
    })
  );

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
