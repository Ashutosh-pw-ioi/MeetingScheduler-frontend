"use client";

import React, { useState, useEffect } from "react";
import { meetings as InitialMeetings } from "../constants/MeetingsData";
import SimpleTable from "../../Table/SimpleTable";
import EmptyList from "./EmptyList";

type Meeting = {
  id: number;
  interviewer_name: string;
  interviewer_email: string;
  interviewer_phone: string;
  scheduled_time: string;
  scheduled_date: string;
};

export default function MeetingsSection() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [todaysMeetings, setTodaysMeetings] = useState<Meeting[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  const [isPastCollapsed, setIsPastCollapsed] = useState<boolean>(true);
  const [isTodaysCollapsed, setIsTodaysCollapsed] = useState<boolean>(false);
  const [isUpcomingCollapsed, setIsUpcomingCollapsed] = useState<boolean>(true);

  function splitMeetingsByDate(meetings: Meeting[]): {
    todays: Meeting[];
    upcoming: Meeting[];
    past: Meeting[];
  } {
    const currentDate = new Date();
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    const todays: Meeting[] = [];
    const upcoming: Meeting[] = [];
    const past: Meeting[] = [];

    meetings.forEach((meeting: Meeting) => {
      const meetingDate = new Date(meeting.scheduled_date);
      const meetingDateOnly = new Date(
        meetingDate.getFullYear(),
        meetingDate.getMonth(),
        meetingDate.getDate()
      );

      if (meetingDateOnly.getTime() === today.getTime()) {
        todays.push(meeting);
      } else if (meetingDateOnly > today) {
        upcoming.push(meeting);
      } else {
        past.push(meeting);
      }
    });

    return { todays, upcoming, past };
  }

  useEffect(() => {
    setMeetings(InitialMeetings);

    const { todays, upcoming, past } = splitMeetingsByDate(InitialMeetings);
    setTodaysMeetings(todays);
    setUpcomingMeetings(upcoming);
    setPastMeetings(past);
  }, []);

  const tableProps = {
    searchFields: ["interviewer_name", "interviewer_email"],
    itemsPerPage: 4,
    badgeFields: ["scheduled_time"],
    arrayFields: [],
    dropdownFields: [],
  };

  return (
    <div className="p-4 relative">
      {meetings.length > 0 ? (
        <div className="w-full space-y-8">
          <div className="text-3xl font-bold mb-8">Meetings Management</div>

          <div className="bg-black p-6 rounded-lg border border-black">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsTodaysCollapsed(!isTodaysCollapsed)}
            >
              <h2 className="text-2xl font-semibold text-white">
                Today&lsquo;s Meetings ({todaysMeetings.length})
              </h2>
              <span className="text-white text-xl">
                {isTodaysCollapsed ? "▼" : "▲"}
              </span>
            </div>
            {!isTodaysCollapsed && (
              <div className="mt-4">
                {todaysMeetings.length > 0 ? (
                  <SimpleTable data={todaysMeetings} {...tableProps} />
                ) : (
                  <p className="text-yellow-600 italic">No meetings today</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-black">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsUpcomingCollapsed(!isUpcomingCollapsed)}
            >
              <h2 className="text-2xl font-semibold text-white">
                Upcoming Meetings ({upcomingMeetings.length})
              </h2>
              <span className="text-white text-xl">
                {isUpcomingCollapsed ? "▼" : "▲"}
              </span>
            </div>
            {!isUpcomingCollapsed && (
              <div className="mt-4">
                {upcomingMeetings.length > 0 ? (
                  <SimpleTable data={upcomingMeetings} {...tableProps} />
                ) : (
                  <p className="text-green-600 italic">No upcoming meetings</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-600 p-6 rounded-lg border border-black">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsPastCollapsed(!isPastCollapsed)}
            >
              <h2 className="text-2xl font-semibold text-white">
                Past Meetings ({pastMeetings.length})
              </h2>
              <span className="text-white text-xl">
                {isPastCollapsed ? "▼" : "▲"}
              </span>
            </div>
            {!isPastCollapsed && (
              <div className="mt-4">
                {pastMeetings.length > 0 ? (
                  <SimpleTable data={pastMeetings} {...tableProps} />
                ) : (
                  <p className="text-gray-600 italic">No past meetings</p>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-screen">
          <EmptyList taskType="meetings" />
        </div>
      )}
    </div>
  );
}
