import { useState, useEffect } from 'react';
import { FormData, FormErrors, TouchedFields } from '../types/booking';
import { validateField, isFormValid as checkFormValid } from '../utils/validation';
import { bookInterview, handleBookingError } from '../services/bookingService';

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
      const response = await bookInterview(formData);
      console.log("Booking successful:", response);
      
      localStorage.setItem("bookingSuccess", JSON.stringify(response));
      onFormDataChange({ name: "", email: "", phone: "" });
      onClose();
      onSuccess();
    } catch (error: unknown) {
      const errorMessage = handleBookingError(error);
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
