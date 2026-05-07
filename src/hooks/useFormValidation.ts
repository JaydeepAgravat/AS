import { useState } from 'react';

interface FieldErrors {
  username?: string;
  password?: string;
}

export const useLoginFormValidation = () => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = (username: string, password: string): boolean => {
    const errors: FieldErrors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const clearAllErrors = () => {
    setFieldErrors({});
  };

  return {
    fieldErrors,
    validate,
    clearFieldError,
    clearAllErrors,
  };
};
