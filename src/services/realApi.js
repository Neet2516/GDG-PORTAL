/**
 * Real Backend API Service
 * Communicates with actual backend following the strict flow:
 * 1. Send OTP → 2. Verify OTP → 3. Payment → 4. Register
 */

import axios from 'axios';

// Configure API base URL - UPDATE THIS WITH YOUR BACKEND URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Add request interceptor for auth tokens if needed
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Add response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

class RealApiService {
  /**
   * STEP 1: Send OTP
   * POST /send-otp
   * 
   * @param {string} name - User's full name
   * @param {string} email - User's email
   * @param {string} studentNumber - Student ID number
   * @returns {Promise} OTP sent confirmation
   */
  async sendOTP(name, email, studentNumber) {
    try {
      const response = await apiClient.post('/send-otp', {
        name,
        email,
        studentNumber,
      });
      return {
        success: true,
        message: response.data.message || 'OTP sent successfully',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: error.response?.status,
      };
    }
  }

  /**
   * STEP 2: Verify OTP
   * POST /verify-otp
   * 
   * @param {string} email - User's email (MUST match send-otp)
   * @param {string} otp - 6-digit OTP code
   * @returns {Promise} Verification status
   */
  async verifyOTP(email, otp) {
    try {
      const response = await apiClient.post('/verify-otp', {
        email,
        otp,
      });
      return {
        success: true,
        message: 'OTP verified successfully',
        data: response.data,
        verificationToken: response.data.verificationToken || response.data.token,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: error.response?.status,
      };
    }
  }

  /**
   * STEP 3 & 4: Register Student
   * POST /register
   * 
   * IMPORTANT: OTP must be verified before calling this!
   * 
   * @param {Object} formData - Complete registration form data
   * @param {string} formData.name - Full name
   * @param {string} formData.email - Email (MUST match OTP email)
   * @param {string} formData.studentNumber - Student number
   * @param {string} formData.phone - Phone number (must be unique)
   * @param {string} formData.branch - Academic branch
   * @param {string} formData.gender - Gender
   * @param {string} formData.residence - Residence type
   * @param {string} formData.transactionId - Unique payment transaction ID
   * @param {string} formData.captchaToken - Google reCAPTCHA token
   * 
   * @returns {Promise} Registration confirmation
   */
  async registerStudent(formData) {
    try {
      // Validate required fields
      const requiredFields = [
        'name',
        'email',
        'studentNumber',
        'phone',
        'branch',
        'gender',
        'residence',
        'transactionId',
        'captchaToken',
      ];

      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      const response = await apiClient.post('/register', formData);
      return {
        success: true,
        message: 'Registration successful',
        registrationId: response.data.registrationId,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        statusCode: error.response?.status,
      };
    }
  }

  /**
   * Check if email is already registered
   * Useful for validation before sending OTP
   */
  async checkEmailExists(email) {
    try {
      const response = await apiClient.get(`/check-email/${email}`);
      return {
        exists: response.data.exists || false,
        message: response.data.message,
      };
    } catch (error) {
      return {
        exists: false,
        message: error.message,
      };
    }
  }

  /**
   * Check if student number is already registered
   */
  async checkStudentNumberExists(studentNumber) {
    try {
      const response = await apiClient.get(`/check-student/${studentNumber}`);
      return {
        exists: response.data.exists || false,
        message: response.data.message,
      };
    } catch (error) {
      return {
        exists: false,
        message: error.message,
      };
    }
  }

  /**
   * Get registration details
   * For displaying confirmation after successful registration
   */
  async getRegistration(registrationId) {
    try {
      const response = await apiClient.get(`/registrations/${registrationId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default new RealApiService();
