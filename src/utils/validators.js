/**
 * Validation Utilities for GDG Portal
 * Robust validators with detailed error messages
 */

import { VALIDATION_RULES } from '../constants/index';

export const validators = {
  /**
   * Validates name field
   */
  validateName: (name) => {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Name is required' };
    }
    
    if (name.trim().length < VALIDATION_RULES.name.minLength) {
      return { valid: false, error: 'Name is too short (minimum 2 characters)' };
    }
    
    if (name.length > VALIDATION_RULES.name.maxLength) {
      return { valid: false, error: 'Name is too long (maximum 100 characters)' };
    }
    
    if (!VALIDATION_RULES.name.pattern.test(name)) {
      return { valid: false, error: 'Name must contain only letters and spaces' };
    }
    
    return { valid: true, error: null };
  },

  /**
   * Validates email with student number matching
   */
  validateEmail: (email, studentNumber = '') => {
    if (!email || email.trim().length === 0) {
      return { valid: false, error: 'Email is required' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!VALIDATION_RULES.email.pattern.test(normalizedEmail)) {
      return { valid: false, error: VALIDATION_RULES.email.message };
    }

    if (studentNumber) {
      const match = normalizedEmail.match(/^[a-zA-Z]+(\d+)@akgec\.ac\.in$/);
      const emailStudentNumber = match?.[1];

      if (emailStudentNumber !== studentNumber) {
        return { 
          valid: false, 
          error: 'Student number in email must match Student Number field' 
        };
      }
    }

    return { valid: true, error: null };
  },

  /**
   * Validates phone number
   */
  validatePhone: (phone) => {
    if (!phone || phone.trim().length === 0) {
      return { valid: false, error: 'Phone number is required' };
    }

    const digitsOnly = phone.replace(/\D/g, '');
    const isStandardTenDigit = /^[1-9]\d{9}$/.test(digitsOnly);
    const isElevenDigitWithLeadingZero = /^0\d{10}$/.test(digitsOnly);

    if (!isStandardTenDigit && !isElevenDigitWithLeadingZero) {
      return { valid: false, error: VALIDATION_RULES.phone.message };
    }

    return { valid: true, error: null };
  },

  /**
   * Validates student number
   */
  validateStudentNumber: (studentNumber) => {
    if (!studentNumber || studentNumber.trim().length === 0) {
      return { valid: false, error: 'Student number is required' };
    }

    if (!VALIDATION_RULES.studentNumber.pattern.test(studentNumber)) {
      return { valid: false, error: VALIDATION_RULES.studentNumber.message };
    }

    return { valid: true, error: null };
  },

  /**
   * Validates branch selection
   */
  validateBranch: (branch) => {
    if (!branch || branch.trim().length === 0) {
      return { valid: false, error: 'Please select your branch' };
    }

    return { valid: true, error: null };
  },

  /**
   * Validates gender selection
   */
  validateGender: (gender) => {
    if (!gender || gender.trim().length === 0) {
      return { valid: false, error: 'Please select your gender' };
    }

    return { valid: true, error: null };
  },

  /**
   * Validates residence selection
   */
  validateResidence: (residence) => {
    if (residence === '' || residence === null || residence === undefined) {
      return { valid: false, error: 'Please specify your residence' };
    }

    return { valid: true, error: null };
  },

  /**
   * Validates entire form
   */
  validateForm: (formData) => {
    const errors = {};

    const nameValidation = validators.validateName(formData.name);
    if (!nameValidation.valid) errors.name = nameValidation.error;

    const emailValidation = validators.validateEmail(formData.email, formData.studentNumber);
    if (!emailValidation.valid) errors.email = emailValidation.error;

    const phoneValidation = validators.validatePhone(formData.phone);
    if (!phoneValidation.valid) errors.phone = phoneValidation.error;

    const studentNumberValidation = validators.validateStudentNumber(formData.studentNumber);
    if (!studentNumberValidation.valid) errors.studentNumber = studentNumberValidation.error;

    const branchValidation = validators.validateBranch(formData.branch);
    if (!branchValidation.valid) errors.branch = branchValidation.error;

    const genderValidation = validators.validateGender(formData.gender);
    if (!genderValidation.valid) errors.gender = genderValidation.error;

    const residenceValidation = validators.validateResidence(formData.residence);
    if (!residenceValidation.valid) errors.residence = residenceValidation.error;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

export default validators;
