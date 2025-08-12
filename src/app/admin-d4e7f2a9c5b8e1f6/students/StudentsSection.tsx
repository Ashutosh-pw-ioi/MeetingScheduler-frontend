"use client";

import React from "react";
import UploadSection from "../UploadSection";
import teacherSchemaInfo from "../StudentSchemaInfo";
const backendUrl = process.env.NEXT_PUBLIC_API_URL;

export default function StudentsSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add Students
        </h2>
      </div>

      <UploadSection
        uploadUrl={`${backendUrl}/api/student/uploadStudents`}
        schemaInfo={teacherSchemaInfo}
      />
    </div>
  );
}
