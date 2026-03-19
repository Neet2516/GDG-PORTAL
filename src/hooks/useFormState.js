/**
 * Custom Hook for Form State Management
 * Handles form data, validation, and submission logic
 */

import { useState, useCallback, useMemo } from 'react';
import { validators } from '../utils/validators';
import { FORM_DEFAULTS } from '../constants/index';

export const useFormState = (initialData = FORM_DEFAULTS) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate entire form whenever form data changes
  const validation = useMemo(() => {
    return validators.validateForm(formData);
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const handleFieldBlur = useCallback((fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  const setFieldValue = useCallback((fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    setTouched(prev => ({
      ...prev,
      [fieldName]: true,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? validation.errors[fieldName] : null;
  }, [touched, validation.errors]);

  return {
    formData,
    setFormData,
    errors: validation.errors,
    touched,
    isValid: validation.isValid,
    handleInputChange,
    handleFieldBlur,
    setFieldValue,
    resetForm,
    getFieldError,
  };
};

export default useFormState;
