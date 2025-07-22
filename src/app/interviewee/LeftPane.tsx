"use client";

import React from "react";
import { Clock, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LeftPane({}) {
  return (
    <div className="bg-white rounded-l-xl px-6 pt-6 sm:border-r-[0.25px] sm:border-black sm:py-6">
      <div className="flex items-center mb-10 justify-between">
        <Image
          src="/PWIOILogo.png"
          alt="PWIOI Logo"
          width={200}
          height={100}
          className="w-50"
        />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Schedule Your
          <br />
          Interview
        </h1>
        <p className="text-gray-600">
          Let&lsquo;s get you ready. Follow the steps below to lock your time
          with us.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-3" />
          <span className="text-sm">Duration: 30 minutes</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Video className="w-4 h-4 mr-3" />
          <span className="text-sm">
            Joining link will be shared once confirmed
          </span>
        </div>
      </div>

      <div className="space-y-4 sm:mb-10 hidden sm:block">
        <div className="flex items-center">
          <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
            1
          </div>
          <span className="font-medium text-sm">Choose a preferred date</span>
        </div>
        <div className="flex items-center">
          <div className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            2
          </div>
          <span className="font-medium text-gray-500 text-sm">
            Pick a convenient time slot
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-7 h-7 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
            3
          </div>
          <span className="font-medium text-gray-500 text-sm">
            Enter your contact details
          </span>
        </div>
      </div>

      <div className="gap-3 hidden sm:flex">
        <Link href="https://pwioi.com/" target="blank">
          <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer">
            Visit Website
          </button>
        </Link>
        <Link href="https://www.youtube.com/@PW-IOI" target="blank">
          <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm cursor-pointer">
            Check YouTube
          </button>
        </Link>
      </div>
    </div>
  );
}
