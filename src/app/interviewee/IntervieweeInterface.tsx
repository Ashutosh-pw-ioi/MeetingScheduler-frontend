"use client";

import LeftPane from "./LeftPane";
import RightPane from "./RightPane";

export default function InterviewScheduler() {
  return (
    <div className="min-h-screen sm:p-4 flex items-center justify-center bg-[#fafafa]">
      <div className="max-w-4xl w-full border-[0.25px] border-black rounded-xl shadow-xl sm:px-4 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <LeftPane />
          <RightPane />
        </div>
      </div>
    </div>
  );
}
