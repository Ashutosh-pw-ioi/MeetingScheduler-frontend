"use client";

import React, { useState } from "react";
import UploadSection from "../UploadSection";
import teacherSchemaInfo from "../StudentSchemaInfo";
import SimpleTable from "@/app/Table/SimpleTable";

const backendUrl = process.env.NEXT_PUBLIC_API_URL;

// 👇 Define exact type for student data
interface StudentRow {
  id: number;
  applicationId: string;
  studentName: string;
  email: string;
  phoneNumber: string;
  status: string;
}

// 👇 Initialize with correct type
const initialMockData: StudentRow[] = [
  {
    id: 1,
    applicationId: "APP001",
    studentName: "Alice Johnson",
    email: "alice.johnson@example.com",
    phoneNumber: "+1-555-123-4567",
    status: "Interview Scheduled",
  },
  {
    id: 2,
    applicationId: "APP002",
    studentName: "Bob Smith",
    email: "bob.smith@example.com",
    phoneNumber: "+1-555-987-6543",
    status: "Not Scheduled",
  },
  {
    id: 3,
    applicationId: "APP003",
    studentName: "Carol Davis",
    email: "carol.davis@example.com",
    phoneNumber: "+1-555-456-7890",
    status: "Interview Scheduled",
  },
  {
    id: 4,
    applicationId: "APP004",
    studentName: "David Wilson",
    email: "david.wilson@example.com",
    phoneNumber: "+1-555-321-0987",
    status: "Not Scheduled",
  },
  {
    id: 5,
    applicationId: "APP005",
    studentName: "Eva Brown",
    email: "eva.brown@example.com",
    phoneNumber: "+1-555-654-3210",
    status: "Interview Scheduled",
  },
];

export default function StudentsSection() {
  const [tableData, setTableData] = useState<StudentRow[]>(initialMockData);

  // ✏️ Handle Edit — typed correctly
  const handleEdit = (updatedRow: StudentRow) => {
    setTableData((prev) =>
      prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
    );
    console.log("✅ Updated row:", updatedRow);
  };

  // 🗑️ Handle Delete — by ID
  const handleDelete = (id: number) => {
    setTableData((prev) => prev.filter((row) => row.id !== id));
    console.log("🗑️ Deleted row with ID:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add Students
        </h2>
      </div>

      {/* Upload Section */}
      <UploadSection
        uploadUrl={`${backendUrl}/api/student/uploadStudents`}
        schemaInfo={teacherSchemaInfo}
      />

      {/* Students Table */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Students List
        </h3>
        <SimpleTable
          title="Student Records"
          data={tableData}
          searchFields={["applicationId", "studentName"]}
          itemsPerPage={10}
          hyperlinkFields={[]}
          badgeFields={["status"]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCellClick={(row, column) => {
            console.log("🖱️ Cell clicked:", row, column);
          }}
        />
      </div>
    </div>
  );
}
