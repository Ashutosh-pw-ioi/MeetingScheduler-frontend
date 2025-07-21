"use client";

import React from "react";
import { Clock, Video } from "lucide-react";

export default function LeftPane() {
  return (
    <div className="border-r-[0.25px] h-full w-2/5 rounded-l-2xl py-10 px-10 flex flex-col justify-between">
      <img src="/PWIOILogo.png" className="w-28 mb-3" alt="PWIOI Logo" />

      <div>
        <h1 className="font-semibold text-4xl text-gray-900 mb-3">
          Schedule Your Interview
        </h1>
        <p className="text-sm text-gray-600">
          Let’s get you ready. Follow the steps below to lock your time with us.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Clock className="w-5 h-5" />
          <span>Duration: 30 minutes</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
          <Video className="w-6 h-6" />
          <span>Joining link will be shared once confirmed</span>
        </div>
      </div>

      <div className="relative my-6">
        <div className="absolute left-3 top-6 bottom-0 w-[2px] bg-gray-300 z-0" />

        <div className="space-y-6 z-10 relative">
          {[
            { number: "1", text: "Choose a preferred date" },
            { number: "2", text: "Pick a convenient time slot" },
            { number: "3", text: "Enter your contact details" },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs font-semibold z-10">
                {step.number}
              </div>
              <p className="text-sm text-gray-700 font-medium">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button className="bg-black px-5 py-2 text-white rounded-md hover:bg-gray-800 transition text-sm cursor-pointer duration-200 ease-in-out">
          Visit Website
        </button>
        <button className="bg-black px-5 py-2 text-white rounded-md hover:bg-gray-800 transition text-sm cursor-pointer duration-200 ease-in-out">
          Watch on YouTube
        </button>
      </div>
    </div>
  );
}
