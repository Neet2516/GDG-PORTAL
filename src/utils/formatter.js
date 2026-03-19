/**
 * Formatter Utilities
 * String formatting and data transformation
 */

export const normalizePhoneNumber = (value) => {
  const digits = (value || '').replace(/\D/g, '');
  
  // Handle numbers with leading 0
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  
  return digits;
};

export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

export const normalizeStudentNumber = (studentNumber) => {
  return studentNumber.trim().toUpperCase();
};

export const formatPhoneForDisplay = (phone) => {
  const normalized = normalizePhoneNumber(phone);
  if (normalized.length !== 10) return phone;
  
  return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
};

export const extractStudentNumberFromEmail = (email) => {
  const match = email.match(/^[a-zA-Z]+(\d+)@akgec\.ac\.in$/);
  return match?.[1] || null;
};

export const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
