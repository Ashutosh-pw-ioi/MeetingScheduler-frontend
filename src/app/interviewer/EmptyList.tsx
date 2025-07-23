"use client";

import React from "react";
import { CircleSlash2 } from "lucide-react";

interface EmptyListProps {
  taskType: string;
}

export default function EmptyList({ taskType }: EmptyListProps) {
  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("en-US", options);
  };

  return (
    <div className="h-full flex items-center justify-center pb-10">
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-16 h-16 bg-white border-2 border-black shadow-3xl rounded-full flex items-center justify-center mb-3">
          <CircleSlash2 className="w-8 h-8" />
        </div>

        <div className="text-3xl font-bold text-black mb-3">
          {getCurrentDate()}
        </div>

        <div className="text-md font-bold">
          No <span className="underline">{taskType}</span> tasks assigned as of
          now
        </div>
      </div>
    </div>
  );
}
