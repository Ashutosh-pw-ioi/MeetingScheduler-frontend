"use client";

import React from "react";
import LeftPane from "./LeftPane";

export default function IntervieweeInterface() {
  return (
    <div className="h-screen w-screen flex items-center justify-center p-10 bg-[#fafafa]">
      <div className="border-[0.25px] shadow-xl rounded-3xl h-full w-[80%] bg-white overflow-hidden flex">
        <LeftPane />
      </div>
    </div>
  );
}
