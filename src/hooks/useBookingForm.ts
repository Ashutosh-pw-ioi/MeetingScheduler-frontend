// hooks/useBookingForm.ts
import { useState, useEffect } from 'react';
import { FormData, FormErrors, TouchedFields } from '../types/booking';
import { validateField, isFormValid as checkFormValid } from '../utils/validation';
import { 
  bookInterview, 
  checkStudentAuthorization, 
  handleAuthorizationError 
} from '../services/bookingService';

interface UseBookingFormReturn {
  errors: FormErrors;
  touched: TouchedFields;
  isBooking: boolean;
  bookingError: string;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleBlur: (field: keyof FormData) => void;
  handleBookingConfirm: () => Promise<void>;
  isFormValid: boolean;
}

export const useBookingForm = (
  isOpen: boolean,
  formData: FormData,
  onFormDataChange: (formData: FormData) => void,
  onSuccess: () => void,
  onClose: () => void
): UseBookingFormReturn => {
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    phone: "",
  });

  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    phone: false,
  });

  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTouched({ name: false, email: false, phone: false });
      setErrors({ name: "", email: "", phone: "" });
      setIsBooking(false);
      setBookingError("");
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof FormData, value: string): void => {
    const updatedFormData: FormData = { ...formData, [field]: value };
    onFormDataChange(updatedFormData);

    if (!touched[field]) {
      setTouched((prev: TouchedFields) => ({ ...prev, [field]: true }));
    }

    const error = validateField(field, value);
    setErrors((prev: FormErrors) => ({ ...prev, [field]: error }));

    if (bookingError) {
      setBookingError("");
    }
  };

  const handleBlur = (field: keyof FormData): void => {
    setTouched((prev: TouchedFields) => ({ ...prev, [field]: true }));
  };

  const handleBookingConfirm = async (): Promise<void> => {
    const isValid = checkFormValid(formData, errors);
    if (!isValid || isBooking) return;

    setIsBooking(true);
    setBookingError("");

    try {
      // Step 1: Check student authorization first
      console.log("Checking student authorization...");
      const authResponse = await checkStudentAuthorization(formData.phone.trim());
      
      if (!authResponse.success) {
        throw new Error(authResponse.message || 'Authorization check failed');
      }

      if (!authResponse.data.authorized) {
        // Student not authorized - show error message
        setBookingError(authResponse.data.message || 'Student not found in database. Please contact admin for registration.');
        return;
      }

      // Step 2: If authorized, proceed with booking
      console.log("Student authorized, proceeding with booking...");
      const bookingResponse = await bookInterview(formData);
      console.log("Booking successful:", bookingResponse);
      
      localStorage.setItem("bookingSuccess", JSON.stringify(bookingResponse));
      onFormDataChange({ name: "", email: "", phone: "" });
      onClose();
      onSuccess();

    } catch (error: unknown) {
      // Handle both authorization and booking errors
      const errorMessage = handleAuthorizationError(error);
      setBookingError(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  return {
    errors,
    touched,
    isBooking,
    bookingError,
    handleInputChange,
    handleBlur,
    handleBookingConfirm,
    isFormValid: checkFormValid(formData, errors),
  };
};
