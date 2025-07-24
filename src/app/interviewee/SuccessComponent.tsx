import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Video,
  ExternalLink,
  CircleCheck,
} from "lucide-react";
import Lottie from "lottie-react";
import successAnimation from "../../../public/success.json";

interface BookingData {
  message: string;
  booking: {
    id: string;
    startTime: string;
    endTime: string;
    startTimeIST: string;
    endTimeIST: string;
    timezone: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
  };
  interviewer: {
    name: string;
    email: string;
  };
  meetingLink?: string;
  importantNote?: string;
  requiresInterviewerAction?: boolean;
  calendarError?: boolean;
}

const SuccessComponent = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [_showContent, setShowContent] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const SuccessAnimation = () => (
    <div className="w-64 h-64 flex items-center justify-center">
      <Lottie animationData={successAnimation} loop={true} autoplay={true} />
    </div>
  );

  useEffect(() => {
    const storedBookingData = localStorage.getItem("bookingSuccess");
    if (storedBookingData) {
      try {
        const parsedData = JSON.parse(storedBookingData);
        setBookingData(parsedData);
      } catch (error) {
        console.error("Error parsing booking data:", error);
      }
    }

    const timer = setTimeout(() => {
      setShowAnimation(false);
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showAnimation) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <SuccessAnimation />
          <h2 className="mt-6 text-2xl font-bold text-gray-900 animate-fade-in">
            Interview Scheduled!
          </h2>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const formatMeetingLink = (link: string) => {
    return link.replace(/^https?:\/\//, "");
  };

  const handleMeetingLinkClick = () => {
    if (bookingData.meetingLink) {
      window.open(bookingData.meetingLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-black p-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <CircleCheck className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white mb-1">
                Congratulations, {bookingData.booking.studentName}!
              </h2>
            </div>
            <p className="text-gray-300 leading-tight text-sm">
              Your interview has been successfully scheduled
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Date & Time
                </h3>
                <p className="text-gray-600 text-xs">
                  {bookingData.booking.startTimeIST}
                </p>
                <p className="text-gray-600 text-xs">
                  {bookingData.booking.timezone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Duration
                </h3>
                <p className="text-gray-600 text-xs">30 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Interviewer
                </h3>
                <p className="text-gray-600 text-xs">
                  {bookingData.interviewer.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  Google Meet
                </h3>
                <button
                  onClick={handleMeetingLinkClick}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between transition-colors group cursor-pointer w-full"
                >
                  <span className="text-gray-700 font-medium text-[10px] sm:text-xs truncate">
                    {bookingData.meetingLink
                      ? formatMeetingLink(bookingData.meetingLink)
                      : "Meeting link will be shared"}
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform flex-shrink-0 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 mx-10">
            *A confirmation email has been sent to{" "}
            {bookingData.booking.studentEmail}
          </p>
          {bookingData.calendarError && (
            <p className="text-xs text-orange-600 mx-10 mt-2">
              *There was an issue with the calendar invitation. Please contact
              the interviewer directly.
            </p>
          )}
        </div>

        {bookingData.importantNote && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> {bookingData.importantNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessComponent;
