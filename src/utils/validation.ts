import { FormErrors, FormData } from '../types/booking';

export const validateField = (field: keyof FormData, value: string): string => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Full name is required";
      if (value.trim().length < 2)
        return "Name must be at least 2 characters";
      if (!/^[a-zA-Z\s'-]+$/.test(value))
        return "Name can only contain letters, spaces, hyphens and apostrophes";
      return "";

    case "email":
      if (!value.trim()) return "Email address is required";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value))
        return "Please enter a valid email address";
      return "";

    case "phone":
      if (!value.trim()) return "Phone number is required";
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(value)) return "Please enter a valid phone number";
      return "";

    default:
      return "";
  }
};

export interface FieldMessage {
  text: string;
  type: 'hint' | 'error';
}

export const getFieldMessage = (
  field: keyof FormErrors,
  touched: Record<keyof FormData, boolean>,
  errors: FormErrors,
  formData: FormData
): FieldMessage | null => {
  if (!touched[field]) {
    if (field === "name" && !formData.name)
      return { text: "Please enter your full name", type: "hint" };
    if (field === "email" && !formData.email)
      return { text: "Please enter your email address", type: "hint" };
  }
  if (errors[field]) {
    return { text: errors[field], type: "error" };
  }
  return null;
};

export const isFormValid = (formData: FormData, errors: FormErrors): boolean => {
  return (
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    errors.name === "" &&
    errors.email === "" &&
    errors.phone === ""
  );
};
