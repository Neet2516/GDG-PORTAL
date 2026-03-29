/**
 * GDG Event Portal - Configuration Constants
 * Centralized event details and settings
 */

// ========================================
// BACKEND API CONFIGURATION
// ========================================
export const API_CONFIG = {
  // UPDATE THIS WITH YOUR BACKEND URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL ,
  TIMEOUT: 15000,
  RETRIES: 3,
};

// ========================================
// RECAPTCHA CONFIGURATION
// ========================================
export const RECAPTCHA_CONFIG = {
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Ld3qY0sAAAAAI2yUHnFaKZgibc54SYZz8w8EJ4U',
  ENABLED: import.meta.env.VITE_RECAPTCHA_ENABLED !== 'false',
};

export const RAZORPAY_CONFIG = {
  KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SSLVA76UgcHjD0',
};

// ========================================
// EVENT CONFIGURATION
// ========================================
export const EVENT_CONFIG = {
  name: 'GDG Event Portal',
  year: 2025,
  eventName: 'Google Developer Groups Summit',
  eventDate: '2025-04-15',
  eventTime: '09:00 AM - 05:00 PM',
  eventLocation: 'AKGEC Campus',
  registrationFee: 0, // Free registration
  description: 'Join us for an immersive learning experience with industry experts and community leaders.',
};

export const USER_BRANCHES = [
  'AIML',
  'CSE',
  'CSE-AIML',
  'CSE-DS',
  'CS',
  'CS-HINDI',
  'CS-IT',
  'CIVIL',
  'EN',
  'ECE',
  'IT',
  'ME',
];

export const RESIDENCE_TYPES = [
  { label: 'Hosteller', value: 'hosteller' },
  { label: 'Dayscholar', value: 'dayscholar' },
];

export const GENDER_OPTIONS = ['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY'];

export const FORM_DEFAULTS = {
  name: '',
  email: '',
  phone: '',
  studentNumber: '',
  branch: '',
  residence: '',
  gender: '',
  year: '',
  referralSource: '',
};

export const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-100 characters with only letters and spaces',
  },
  email: {
    pattern: /^[a-zA-Z]+25\d+@akgec\.ac\.in$/,
    message: 'Email must be in format: name25xxxx@akgec.ac.in',
  },
  phone: {
    minLength: 10,
    maxLength: 11,
    pattern: /^([1-9]\d{9}|0\d{10})$/,
    message: 'Phone must be 10 digits, or 11 digits starting with 0',
  },
  studentNumber: {
    pattern: /^25\d{4,7}$/,
    message: 'Student number must start with 25 and contain 6-9 digits total',
  },
};

export const API_RESPONSES = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
};

export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
};

export const REQUEST_TIMEOUTS = {
  OTP: 120000, // 2 minutes
  PAYMENT: 300000, // 5 minutes
  GENERAL: 30000, // 30 seconds
};

// ========================================
// REGISTRATION FLOW STAGES
// ========================================
export const REGISTRATION_FLOW = {
  FORM: 'form',           // Step 1: Fill registration form
  OTP_SEND: 'otp_send',   // Step 1.5: Send OTP
  OTP_VERIFY: 'otp_verify', // Step 2: Verify OTP
  PAYMENT: 'payment',      // Step 3: Complete payment
  REGISTER: 'register',    // Step 4: Submit registration
  SUCCESS: 'success',      // Success
};
