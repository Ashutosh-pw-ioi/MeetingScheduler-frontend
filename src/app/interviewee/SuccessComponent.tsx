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

const SuccessComponent = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const SuccessAnimation = () => (
    <div className="">
      <Lottie animationData={successAnimation} loop={true} autoplay={true} />
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showAnimation) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <SuccessAnimation />
          <h2 className="mt-6 text-2xl font-bold text-gray-900 animate-fade-in">
            Interview Scheduled!
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-black p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <CircleCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Congratulations, UserName!
            </h2>
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
                <p className="text-gray-600 text-xs">Monday, July 28, 2025</p>
                <p className="text-gray-600 text-xs">10:00 AM - 10:30 AM IST</p>
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
                <p className="text-gray-600 text-xs">Dr. Sarah Johnson</p>
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
                <button className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-between transition-colors group cursor-pointer">
                  <span className="text-gray-700 font-medium text-xs truncate">
                    meet.google.com/xyz-abc-def
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:scale-110 transition-transform flex-shrink-0 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mx-10">
            *A confirmation email has been sent to your registered email address
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessComponent;
