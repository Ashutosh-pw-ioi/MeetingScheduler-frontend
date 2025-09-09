"use client";

import React, { useState, useEffect } from "react";
import UploadSection from "../UploadSection";
import teacherSchemaInfo from "../StudentSchemaInfo";
import SimpleTable from "@/app/Table/SimpleTable";
import ShimmerLoader from "./ShimmerLoader"; 

const backendUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = `${backendUrl}/api/student`;

interface StudentRow {
  id: string;
  applicationId: string;
  studentName: string; 
  email: string;
  phoneNumber: string; 
  department: string;
  status: string;
}

export default function StudentsSection() {
  const [tableData, setTableData] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // 👈 New state for initial load

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/getAllStudents`);
      const result = await response.json();

      if (result.success) {
        const transformedData: StudentRow[] = result.data.map((student: any) => ({
          id: student.id,
          applicationId: student.applicationId,
          studentName: student.name,
          email: student.email,
          phoneNumber: student.phone,
          department: student.department,
          status: student.status === "booked" ? "Interview Scheduled" : "Not Scheduled",
        }));
        setTableData(transformedData);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false); 
    }
  };

  const handleEdit = async (updatedRow: StudentRow) => {
    try {
      const updateData = {
        applicationId: updatedRow.applicationId,
        name: updatedRow.studentName,
        email: updatedRow.email,
        phone: updatedRow.phoneNumber,
        department: updatedRow.department,
      };

      const response = await fetch(`${baseUrl}/updateStudent/${updatedRow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        await fetchStudents();
        console.log("✅ Updated row:", updatedRow);
      } else {
        console.error("Update failed:", result.message);
        alert("Failed to update student: " + result.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update student");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/deleteStudent/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setTableData((prev) => prev.filter((row) => row.id !== id));
        console.log("🗑️ Deleted row with ID:", id);
      } else {
        console.error("Delete failed:", result.message);
        alert("Failed to delete student: " + result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete student");
    }
  };

  const handleUploadSuccess = () => {
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add Students
        </h2>
      </div>

      <UploadSection
        uploadUrl={`${baseUrl}/uploadStudents`}
        schemaInfo={teacherSchemaInfo}
        onSuccess={handleUploadSuccess} 
      />

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Students List {loading && !initialLoading && "(Refreshing...)"} {/* 👈 Updated loading text */}
        </h3>
        
        {/* 👇 Conditional rendering with shimmer effect */}
        {initialLoading ? (
          <ShimmerLoader rows={8} />
        ) : (
          <SimpleTable
            title="Student Records"
            data={tableData}
            searchFields={["applicationId", "studentName"]}
            itemsPerPage={10}
            hyperlinkFields={[]}
            badgeFields={["status", "department"]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCellClick={(row, column) => {
              console.log("🖱️ Cell clicked:", row, column);
            }}
          />
        )}
      </div>
    </div>
  );
}
