/**
 * Real backend API service.
 * Uses only public config from Vite env and never stores backend secrets.
 */

import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
const API_BASE_URL =
  rawBaseUrl && rawBaseUrl !== 'undefined' && rawBaseUrl !== 'null'
    ? rawBaseUrl.replace(/\/+$/, '')
    : 'http://localhost:5000';
const API_PREFIX = (import.meta.env.VITE_API_PREFIX || '/api/v1').startsWith('/')
  ? import.meta.env.VITE_API_PREFIX || '/api/v1'
  : `/${import.meta.env.VITE_API_PREFIX}`;
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 60000);

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

const BRANCH_MAP = {
  'CSE-AIML': 'CSE(AIML)',
  'CSE-DS': 'CSE(DS)',
  'CS-HINDI': 'CSE(H)',
  'CS-IT': 'CSIT',
  CIVIL: 'Civil',
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
            };

      const { data } = await postWithRetry('/send-otp', {
        name: payload.name,
        email: payload.email?.trim()?.toLowerCase?.(),
        studentNumber: payload.studentNumber,
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
