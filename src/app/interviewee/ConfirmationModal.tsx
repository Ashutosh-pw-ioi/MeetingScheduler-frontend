// components/ConfirmationModal.tsx
import React from "react";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import { ConfirmationModalProps, FormData } from "../../types/booking";
import { useBookingForm } from "../../hooks/useBookingForm";
import { getFieldMessage } from "../../utils/validation";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  selectedTime,
  formData,
  onFormDataChange,
}) => {
  const {
    errors,
    touched,
    isBooking,
    bookingError,
    handleInputChange,
    handleBlur,
    handleBookingConfirm,
    isFormValid,
  } = useBookingForm(isOpen, formData, onFormDataChange, onConfirm, onClose);

  if (!isOpen) return null;

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Enhanced phone input handler that restricts input to digits only and limits to 10 characters
  const handlePhoneInputChange = (value: string) => {
    // Only allow digits and limit to 10 characters
    const cleanValue = value.replace(/\D/g, "").slice(0, 10);
    handleInputChange("phone", cleanValue);
  };

  const handleFieldChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "phone") {
        handlePhoneInputChange(e.target.value);
      } else {
        handleInputChange(field, e.target.value);
      }
    };

  const handleFieldBlur = (field: keyof FormData) => () => {
    handleBlur(field);
  };

  // Updated button text to show different states
  const getButtonText = (): string => {
    if (isBooking) {
      return "Checking Authorization...";
    }
    return "Confirm Interview";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full mx-2 sm:mx-4 sm:max-w-4xl transform transition-all flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Confirm Your Interview
          </h2>
          <button
            onClick={onClose}
            disabled={isBooking}
            className="text-gray-600 hover:text-black transition-colors cursor-pointer p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-4 sm:p-6 lg:border-r border-gray-200 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-black mb-4 sm:mb-6">
                Your Information
              </h3>

              {bookingError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <AlertCircle
                      size={16}
                      className="text-red-500 mr-2 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-red-700 text-sm">
                      <p className="font-medium">Authorization Failed</p>
                      <p className="mt-1">{bookingError}</p>
                      {bookingError.includes('not found in database') && (
                        <p className="mt-2 text-xs">
                          Please contact admin for registration or verify your phone number.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 sm:space-y-5 max-w-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleFieldChange("name")}
                    onBlur={handleFieldBlur("name")}
                    placeholder="Enter your full name"
                    disabled={isBooking}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                      getFieldMessage("name", touched, errors, formData)
                        ?.type === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {(() => {
                    const message = getFieldMessage(
                      "name",
                      touched,
                      errors,
                      formData
                    );
                    return (
                      message && (
                        <div
                          className={`flex items-start mt-2 text-sm ${
                            message.type === "error"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {message.type === "error" && (
                            <AlertCircle
                              size={14}
                              className="mr-1 mt-0.5 flex-shrink-0"
                            />
                          )}
                          <span>{message.text}</span>
                        </div>
                      )
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange("email")}
                    onBlur={handleFieldBlur("email")}
                    placeholder="Enter registered email address"
                    disabled={isBooking}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                      getFieldMessage("email", touched, errors, formData)
                        ?.type === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {(() => {
                    const message = getFieldMessage(
                      "email",
                      touched,
                      errors,
                      formData
                    );
                    return (
                      message && (
                        <div
                          className={`flex items-start mt-2 text-sm ${
                            message.type === "error"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {message.type === "error" && (
                            <AlertCircle
                              size={14}
                              className="mr-1 mt-0.5 flex-shrink-0"
                            />
                          )}
                          <span>{message.text}</span>
                        </div>
                      )
                    );
                  })()}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handleFieldChange("phone")}
                    onBlur={handleFieldBlur("phone")}
                    placeholder="Enter registered phone number"
                    disabled={isBooking}
                    maxLength={10}
                    className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                      getFieldMessage("phone", touched, errors, formData)
                        ?.type === "error"
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {(() => {
                    const message = getFieldMessage(
                      "phone",
                      touched,
                      errors,
                      formData
                    );
                    return (
                      message && (
                        <div
                          className={`flex items-start mt-2 text-sm ${
                            message.type === "error"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {message.type === "error" && (
                            <AlertCircle
                              size={14}
                              className="mr-1 mt-0.5 flex-shrink-0"
                            />
                          )}
                          <span>{message.text}</span>
                        </div>
                      )
                    );
                  })()}
                </div>

                <div className="text-xs text-gray-600 pt-2">
                  All fields are required. Phone number must be registered in our system.
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 bg-gray-50 lg:bg-white min-w-0 border-t lg:border-t-0">
              <h3 className="text-base sm:text-lg font-medium text-black mb-4">
                Interview Details
              </h3>
              <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
                Please confirm your interview details with the Institute of
                Innovation:
              </p>

              <div className="bg-white lg:bg-gray-50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 border border-gray-200">
                <div className="flex items-start mb-4">
                  <Calendar
                    className="text-black mr-3 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-black break-words text-sm sm:text-base">
                      {formatDate(selectedDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock
                    className="text-black mr-3 mt-0.5 flex-shrink-0"
                    size={18}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-black text-sm sm:text-base">
                      {selectedTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-sm text-gray-800">
                  <strong>Note:</strong> Your phone number will be verified against our registered student database. Please ensure you use the same phone number used during registration.
                </p>
              </div>

              <div className="text-sm text-gray-700">
                <p className="mb-2">
                  Duration: <strong>30 minutes</strong>
                </p>
                <p>A joining link will be shared once confirmed.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isBooking}
            type="button"
            className="flex-1 px-4 py-3 text-black bg-white border-2 border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-100 ease-in-out font-medium cursor-pointer text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleBookingConfirm}
            disabled={!isFormValid || isBooking}
            type="button"
            className={`flex-1 px-4 py-3 rounded-md transition-colors font-medium duration-100 ease-in-out text-sm sm:text-base ${
              isFormValid && !isBooking
                ? "bg-black text-white hover:bg-gray-950 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
