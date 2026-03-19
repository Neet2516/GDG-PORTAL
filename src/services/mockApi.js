/**
 * Mock API Service - Replaces real backend during development
 * Simulates OTP, payment, and registration endpoints
 */

import { delay, generateRegistrationId, getRandomDelay } from '../utils/helpers';
import { API_RESPONSES, REQUEST_TIMEOUTS } from '../constants/index';

class MockApiService {
  constructor() {
    // Simulate stored sessions
    this.sessions = new Map();
    this.registrations = new Map();
    this.paymentAttempts = new Map();
  }

  /**
   * Send OTP to email
   * Mock endpoint that simulates backend OTP generation
   */
  async sendOTP(email) {
    await delay(getRandomDelay());

    // Simulate validation
    if (!email.includes('@akgec.ac.in')) {
      return {
        success: false,
        message: 'Please use your college email address',
        statusCode: 400,
      };
    }

    // Generate mock OTP (use 123456 for testing)
    const otp = '123456';
    const timestamp = Date.now();
    const sessionId = `session_${timestamp}`;

    // Store session in memory
    this.sessions.set(email, {
      otp,
      sessionId,
      timestamp,
      attempts: 0,
      maxAttempts: 5,
    });

    return {
      success: true,
      message: 'OTP sent to your email',
      data: {
        sessionId,
        // In a real app, never send OTP in response - only for demo
        otpForTesting: otp,
      },
      statusCode: 200,
    };
  }

  /**
   * Verify OTP submitted by user
   */
  async verifyOTP(email, otp) {
    await delay(getRandomDelay());

    const session = this.sessions.get(email);

    if (!session) {
      return {
        success: false,
        message: 'OTP session expired. Please send OTP again.',
        statusCode: 400,
      };
    }

    // Check max attempts
    if (session.attempts >= session.maxAttempts) {
      this.sessions.delete(email);
      return {
        success: false,
        message: 'Too many attempts. Please send OTP again.',
        statusCode: 429,
      };
    }

    // Verify OTP
    if (otp !== session.otp) {
      session.attempts += 1;
      return {
        success: false,
        message: `Invalid OTP. ${session.maxAttempts - session.attempts} attempts remaining.`,
        statusCode: 400,
      };
    }

    // OTP verified
    const verificationToken = `token_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    session.verified = true;
    session.verificationToken = verificationToken;

    return {
      success: true,
      message: 'Email verified successfully',
      data: {
        verificationToken,
      },
      statusCode: 200,
    };
  }

  /**
   * Register user with complete information
   */
  async registerUser(formData, verificationToken) {
    await delay(getRandomDelay());

    // Verify token
    const session = Array.from(this.sessions.values()).find(
      s => s.verificationToken === verificationToken
    );

    if (!session || !session.verified) {
      return {
        success: false,
        message: 'Verification token invalid or expired',
        statusCode: 401,
      };
    }

    // Check for duplicate registration
    const existingReg = Array.from(this.registrations.values()).find(
      r => r.email === formData.email
    );

    if (existingReg) {
      return {
        success: false,
        message: 'This email is already registered',
        statusCode: 409,
      };
    }

    // Create registration record
    const registrationId = generateRegistrationId();
    const registration = {
      registrationId,
      ...formData,
      registeredAt: new Date().toISOString(),
      status: 'PENDING_PAYMENT',
    };

    this.registrations.set(registrationId, registration);

    return {
      success: true,
      message: 'Registration created successfully',
      data: {
        registrationId,
        registration,
      },
      statusCode: 200,
    };
  }

  /**
   * Initiate payment (mock Razorpay integration)
   */
  async initiatePayment(registrationId, amount = 0) {
    await delay(getRandomDelay());

    const registration = this.registrations.get(registrationId);

    if (!registration) {
      return {
        success: false,
        message: 'Registration not found',
        statusCode: 404,
      };
    }

    // For free events, auto-complete
    if (amount === 0) {
      registration.status = 'PAYMENT_COMPLETED';
      registration.paymentId = `free_${Date.now()}`;
      return {
        success: true,
        message: 'Event is free! Registration completed.',
        data: {
          paymentId: registration.paymentId,
          registrationId,
          status: 'COMPLETED',
        },
        statusCode: 200,
      };
    }

    // Mock payment order
    const paymentId = `pay_${Date.now()}`;
    this.paymentAttempts.set(paymentId, {
      registrationId,
      amount,
      timestamp: Date.now(),
      status: 'INITIATED',
    });

    return {
      success: true,
      message: 'Payment initiated',
      data: {
        paymentId,
        amount,
        orderId: `order_${Date.now()}`,
      },
      statusCode: 200,
    };
  }

  /**
   * Verify payment completion
   */
  async verifyPayment(paymentId) {
    await delay(getRandomDelay());

    const payment = this.paymentAttempts.get(paymentId);

    if (!payment) {
      return {
        success: false,
        message: 'Payment record not found',
        statusCode: 404,
      };
    }

    // Mark as completed
    payment.status = 'VERIFIED';
    const registration = this.registrations.get(payment.registrationId);
    if (registration) {
      registration.status = 'REGISTERED';
      registration.completedAt = new Date().toISOString();
    }

    return {
      success: true,
      message: 'Payment verified successfully',
      data: {
        registrationId: payment.registrationId,
        paymentId,
        status: 'SUCCESS',
      },
      statusCode: 200,
    };
  }

  /**
   * Get registration details
   */
  async getRegistration(registrationId) {
    await delay(getRandomDelay(300, 800));

    const registration = this.registrations.get(registrationId);

    if (!registration) {
      return {
        success: false,
        message: 'Registration not found',
        statusCode: 404,
      };
    }

    return {
      success: true,
      data: registration,
      statusCode: 200,
    };
  }
}

export const mockApi = new MockApiService();
export default mockApi;
