/**
 * Real backend API service.
 *
 * The axios client targets '/api' so requests stay same-origin in the browser.
 */

import axios from 'axios';

const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 60000);

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

const BRANCH_MAP = {
  'CSE AI&ML': 'CSE(AIML)',
  'CSE-AIML': 'CSE(AIML)',
  'CSE DS': 'CSE(DS)',
  'CSE-DS': 'CSE(DS)',
  'CS(Hindi)': 'CSE(H)',
  'CS-HINDI': 'CSE(H)',
  'CS/IT': 'CSIT',
  'CS-IT': 'CSIT',
  CIVIL: 'Civil',
  Civil: 'Civil',
};

const GENDER_MAP = {
  MALE: 'Male',
  FEMALE: 'Female',
};

const RESIDENCE_MAP = {
  hosteller: 'Hosteller',
  dayscholar: 'Day Scholar',
};

const errorResponse = (error, fallback) => ({
  success: false,
  message:
    error?.code === 'ECONNABORTED'
      ? 'Request timed out. Backend may be cold-starting; please retry.'
      : (error?.response?.data?.message || error?.message || fallback),
  statusCode: error?.response?.status,
  data: error?.response?.data,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postWithRetry = async (url, body, retries = 1) => {
  try {
    return await apiClient.post(url, body);
  } catch (error) {
    if (retries > 0 && error?.code === 'ECONNABORTED') {
      await sleep(1200);
      return postWithRetry(url, body, retries - 1);
    }
    throw error;
  }
};

const normalizeRegistrationPayload = (formData) => {
  const gender = GENDER_MAP[formData.gender] || formData.gender;
  if (!gender || !['Male', 'Female'].includes(gender)) {
    throw new Error('Gender must be Male or Female');
  }

  return {
    ...formData,
    branch: BRANCH_MAP[formData.branch] || formData.branch,
    gender,
    residence: RESIDENCE_MAP[formData.residence] || formData.residence,
    email: formData.email?.trim()?.toLowerCase?.() || formData.email,
    transactionId: formData.transactionId || formData.razorpay_payment_id,
  };
};

class RealApiService {
  async health() {
    try {
      const { data } = await apiClient.get('/health');
      return { success: true, data, message: data?.message || 'Server is healthy' };
    } catch (error) {
      return errorResponse(error, 'Health check failed');
    }
  }

  async sendOTP(nameOrPayload, emailArg, studentNumberArg, captchaTokenArg) {
    try {
      const payload =
        typeof nameOrPayload === 'object'
          ? nameOrPayload
          : {
              name: nameOrPayload,
              email: emailArg,
              studentNumber: studentNumberArg,
              captchaToken: captchaTokenArg,
            };

      const { data } = await postWithRetry('/send-otp', {
        name: payload.name,
        email: payload.email?.trim()?.toLowerCase?.(),
        studentNumber: payload.studentNumber,
        captchaToken: payload.captchaToken || captchaTokenArg,
      });
      return {
        success: true,
        message: data?.message || 'OTP sent',
        data,
      };
    } catch (error) {
      return errorResponse(error, 'Failed to send OTP');
    }
  }

  async verifyOTP(email, otp) {
    try {
      const { data } = await postWithRetry('/verify-otp', {
        email: email?.trim()?.toLowerCase?.(),
        otp,
      });
      return {
        success: true,
        message: data?.message || 'OTP verified',
        data,
        verificationToken: data?.verificationToken || data?.token || 'otp_verified',
      };
    } catch (error) {
      return errorResponse(error, 'Failed to verify OTP');
    }
  }

  async createOrder(payload = {}) {
    try {
      const { data } = await apiClient.post('/create-order', payload);
      return {
        success: true,
        message: data?.message || 'Order created',
        data,
        order: data?.order || data?.data?.order || data,
      };
    } catch (error) {
      if (error?.response?.status === 404) {
        return {
          success: false,
          message: 'Payment order endpoint was not found on the deployed backend.',
          statusCode: 404,
          data: error?.response?.data,
        };
      }
      return errorResponse(error, 'Failed to create payment order');
    }
  }

  async registerStudent(formData) {
    try {
      const payload = normalizeRegistrationPayload(formData);
      const { data } = await apiClient.post('/register', payload);
      return {
        success: true,
        message: data?.message || 'Registration successful',
        registrationId: data?.registrationId || data?.data?._id,
        data: data?.data || data,
      };
    } catch (error) {
      return errorResponse(error, 'Failed to complete registration');
    }
  }
}

export default new RealApiService();
