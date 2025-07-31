"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, ArrowRight, User, Mail, Phone } from "lucide-react";
import axios from "axios";
import CalendarComponent from "./CalendarComponent";

interface RightPaneProps {
  onDateClick?: (date: Date, formData: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  _authorization?: string;
}

interface TouchedFields {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    authorized: boolean;
    message: string;
  };
  message: string;
}

export default function RightPane({ onDateClick }: RightPaneProps) {
  const [currentStep, setCurrentStep] = useState<"form" | "calendar">("form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("interviewFormData");
      if (savedFormData) {
        try {
          const parsed = JSON.parse(savedFormData);
          setFormData(parsed);
          if (
            parsed.name &&
            parsed.email &&
            parsed.phone &&
            validateForm(parsed)
          ) {
            setCurrentStep("calendar");
          }
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      }
    }
  }, []);

  const validateField = (
    field: keyof FormData,
    value: string
  ): string | null => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return null;

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return null;

      case "phone":
        if (!value.trim()) return "Phone number is required";
        const cleanPhone = value.replace(/\D/g, "");
        if (cleanPhone.length !== 10)
          return "Phone number must be exactly 10 digits";
        return null;

      default:
        return null;
    }
  };

  const validateForm = (data: FormData): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(data).forEach((key) => {
      const field = key as keyof FormData;
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkStudentAuthorization = async (phone: string): Promise<boolean> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL not configured");
      }

      const response = await axios.post<ApiResponse>(
        `${apiUrl}/api/student/checkStudents`,
        { phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success && response.data.data.authorized) {
        return true;
      } else {
        setErrors((prev) => ({
          ...prev,
          _authorization: response.data.data.message || "Student not authorized",
        }));
        return false;
      }
    } catch (error) {
      console.error("Authorization check failed:", error);

      let errorMessage = "Failed to verify student authorization";

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Please try again.";
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid phone number format";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (!error.response) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = error.response?.data?.message || errorMessage;
        }
      }

      setErrors((prev) => ({
        ...prev,
        _authorization: errorMessage,
      }));
      return false;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    if (field === "phone") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    const newFormData = { ...formData, [field]: processedValue };
    setFormData(newFormData);

    if (typeof window !== "undefined") {
      localStorage.setItem("interviewFormData", JSON.stringify(newFormData));
    }

    if (field === "phone" && errors._authorization) {
      setErrors((prev) => {
        const { _authorization, ...rest } = prev;
        return rest;
      });
    }

    if (touched[field]) {
      const error = validateField(field, processedValue);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    setErrors((prev) => {
      const { _authorization, ...rest } = prev;
      return rest;
    });

    setTouched({ name: true, email: true, phone: true });

    if (!validateForm(formData)) {
      setIsValidating(false);
      return;
    }

    try {
      const isAuthorized = await checkStudentAuthorization(formData.phone);

      if (isAuthorized) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setCurrentStep("calendar");
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDateClick = (date: Date | Date[]) => {
    if (!Array.isArray(date)) {
      onDateClick?.(date, formData);
    }
  };

  const getFieldError = (field: keyof FormData) => {
    return touched[field] && errors[field] ? errors[field] : null;
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      Object.keys(errors).every((key) => {
        const errorKey = key as keyof ValidationErrors;
        return !errors[errorKey] || errorKey === "_authorization";
      })
    );
  };

  if (currentStep === "calendar") {
    return (
      <div className="bg-white rounded-r-xl px-6 sm:px-8 py-4 sm:py-6 flex flex-col items-start justify-start space-y-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-left">
            Select Date and Time
          </h2>
        </div>

        <CalendarComponent onDateClick={handleDateClick} multiSelect={false} />

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 flex items-start gap-3 sm:w-[90%]">
          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <p className="text-sm text-gray-800 leading-tight">
            Please cautiously select your preferred date and time. Once
            confirmed, changes may not be possible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-r-xl px-6 sm:px-8 py-4 sm:py-6 flex flex-col items-start justify-start space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-left">
          Your Information
        </h2>

        <p className="text-gray-600 text-sm">
          Please provide your details to proceed with the interview scheduling.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="Enter your full name"
            disabled={isValidating}
            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
              getFieldError("name")
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {getFieldError("name") && (
            <div className="flex items-start mt-2 text-sm text-red-600">
              <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>{getFieldError("name")}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail size={16} className="inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="Enter registered email address"
            disabled={isValidating}
            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
              getFieldError("email")
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {getFieldError("email") && (
            <div className="flex items-start mt-2 text-sm text-red-600">
              <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>{getFieldError("email")}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone size={16} className="inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            placeholder="Enter registered phone number"
            disabled={isValidating}
            maxLength={10}
            className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-md transition-colors focus:outline-none text-base disabled:opacity-50 disabled:cursor-not-allowed ${
              getFieldError("phone") || errors._authorization
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-black"
            }`}
          />
          {getFieldError("phone") && (
            <div className="flex items-start mt-2 text-sm text-red-600">
              <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
              <span>{getFieldError("phone")}</span>
            </div>
          )}
        </div>

        {errors._authorization && (
          <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle
              size={16}
              className="text-red-600 mr-2 mt-0.5 flex-shrink-0"
            />
            <span className="text-sm text-red-700">{errors._authorization}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid() || isValidating}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-colors font-medium duration-100 ease-in-out text-sm sm:text-base ${
            isFormValid() && !isValidating
              ? "bg-black text-white hover:bg-gray-950 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Verifying Student...
            </>
          ) : (
            <>
              Continue to Calendar
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 sm:p-4 flex items-start gap-3 w-full">
        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <p className="text-sm text-gray-800 leading-tight">
          Please ensure you use the same phone number used during registration.
        </p>
      </div>
    </div>
  );
}
