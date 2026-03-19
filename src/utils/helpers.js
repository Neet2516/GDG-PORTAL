/**
 * Generic utility functions
 */

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateRegistrationId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `REG${timestamp}${random}`;
};

export const getRandomDelay = (min = 500, max = 1500) => {
  return Math.random() * (max - min) + min;
};

export const maskEmail = (email) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

export const maskPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  return '*'.repeat(digits.length - 4) + digits.slice(-4);
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
