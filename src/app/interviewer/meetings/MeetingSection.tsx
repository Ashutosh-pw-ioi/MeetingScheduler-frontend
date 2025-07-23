"use client";

import React, { useState, useEffect, useRef } from "react";
import SimpleTable from "../../Table/SimpleTable";
import EmptyList from "../EmptyList";
import { MeetingsService } from "../../../services/meetingService";
import { Meeting, CategorizedMeetings } from "../../../types/meeting";
import { AlertCircle, RefreshCw, Users, Calendar, Clock, ExternalLink } from "lucide-react";

export default function MeetingsSection() {
  const [meetings, setMeetings] = useState<CategorizedMeetings>({
    todays: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPastCollapsed, setIsPastCollapsed] = useState<boolean>(true);
  const [isTodaysCollapsed, setIsTodaysCollapsed] = useState<boolean>(false);
  const [isUpcomingCollapsed, setIsUpcomingCollapsed] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const hasInitialized = useRef(false);

  const loadMeetingsData = async (): Promise<void> => {
    try {
      setError(null);
      const meetingsData = await MeetingsService.getAllMeetings();
      
      // Format meetings for table display with proper IDs
      const formattedMeetings: CategorizedMeetings = {
        todays: meetingsData.todays.map((meeting, index) => 
          MeetingsService.formatMeetingForTable(meeting, index)
        ),
        upcoming: meetingsData.upcoming.map((meeting, index) => 
          MeetingsService.formatMeetingForTable(meeting, index)
        ),
        past: meetingsData.past.map((meeting, index) => 
          MeetingsService.formatMeetingForTable(meeting, index)
        )
      };
      
      setMeetings(formattedMeetings);
      console.log('Formatted meetings data:', formattedMeetings);
    } catch (error) {
      console.error('Failed to load meetings:', error);
      setError('Failed to load meetings data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    loadMeetingsData();
  }, []);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadMeetingsData();
  };

  const handleJoinMeeting = (meetingLink: string | null): void => {
    if (meetingLink && meetingLink !== 'Not available') {
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  const tableProps = {
    searchFields: ["student_name", "student_email", "student_phone"],
    itemsPerPage: 5,
    badgeFields: ["scheduled_time"],
    arrayFields: [],
    dropdownFields: [],
  };

  // Custom render function for meeting link
  const renderMeetingLink = (meeting: Meeting): JSX.Element => {
    if (!meeting.meeting_link || meeting.meeting_link === 'Not available') {
      return (
        <span className="text-gray-400 text-sm">Not available</span>
      );
    }

    return (
      <button
        onClick={() => handleJoinMeeting(meeting.meeting_link)}
        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Join Meeting
      </button>
    );
  };

  // Enhanced table component that includes meeting link rendering
  const EnhancedTable: React.FC<{ data: Meeting[] }> = ({ data }) => {
    if (data.length === 0) {
      return <p className="text-gray-400 italic">No meetings found</p>;
    }

    return (
      <div className="space-y-4">
        {data.map((meeting) => (
          <div key={meeting.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Student</p>
                <p className="font-medium">{meeting.student_name}</p>
                <p className="text-sm text-gray-600">{meeting.student_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{meeting.student_phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Schedule</p>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{meeting.scheduled_date}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800`}>
                    {meeting.scheduled_time}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Meeting Link</p>
                {renderMeetingLink(meeting)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 relative">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your meetings...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalMeetings = meetings.todays.length + meetings.upcoming.length + meetings.past.length;

  return (
    <div className="p-4 relative">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {totalMeetings > 0 ? (
        <div className="w-full space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Meetings Management</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{totalMeetings} Total Meetings</span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Today's Meetings */}
          <div className="bg-black p-6 rounded-lg border border-black">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsTodaysCollapsed(!isTodaysCollapsed)}
            >
              <h2 className="text-2xl font-semibold text-white">
                Today&lsquo;s Meetings ({meetings.todays.length})
              </h2>
              <span className="text-white text-xl">
                {isTodaysCollapsed ? "▼" : "▲"}
              </span>
            </div>
            {!isTodaysCollapsed && (
              <div className="mt-4">
                {meetings.todays.length > 0 ? (
                  <EnhancedTable data={meetings.todays} />
                ) : (
                  <p className="text-yellow-600 italic">No meetings today</p>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Meetings */}
          <div className="bg-gray-700 p-6 rounded-lg border border-black">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsUpcomingCollapsed(!isUpcomingCollapsed)}
            >
              <h2 className="text-2xl font-semibold text-white">
                Upcoming Meetings ({meetings.upcoming.length})
              </h2>
              <span className="text-white text-xl">
                {isUpcomingCollapsed ? "▼" : "▲"}
              </span>
            </div>
            {!isUpcomingCollapsed && (
              <div className="mt-4">
                {meetings.upcoming.length > 0 ? (
                  <EnhancedTable data={meetings.upcoming} />
                ) : (
                  <p className="text-green-600 italic">No upcoming meetings</p>
                )}
              </div>
            )}
          </div>

          {/* Past Meetings */}
          <div className="bg-gray-600 p-6 rounded-lg border border-black">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsPastCollapsed(!isPastCollapsed)}
            >
              <h2 className="text-2xl font-semibold text-white">
                Past Meetings ({meetings.past.length})
              </h2>
              <span className="text-white text-xl">
                {isPastCollapsed ? "▼" : "▲"}
              </span>
            </div>
            {!isPastCollapsed && (
              <div className="mt-4">
                {meetings.past.length > 0 ? (
                  <EnhancedTable data={meetings.past} />
                ) : (
                  <p className="text-gray-400 italic">No past meetings</p>
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
