import React from "react";
import { X, Calendar, Clock } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDate: string;
  selectedTime: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  selectedTime,
}) => {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-black">
            Confirm Your Interview
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Please confirm your interview details with the Institute of
            Innovation:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center mb-3">
              <Calendar className="text-black mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-black">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Clock className="text-black mr-3" size={20} />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium text-black">{selectedTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-800">
              <strong>Note:</strong> Once confirmed, changes may not be
              possible. Please ensure the selected date and time work for your
              schedule.
            </p>
          </div>

          <p className="text-sm text-gray-700">
            Duration: <strong>30 minutes</strong>
            <br />A joining link will be shared once confirmed.
          </p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-black bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-100 ease-in-out font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-950 transition-colors font-medium cursor-pointer duration-100 ease-in-out"
          >
            Confirm Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
