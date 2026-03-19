/**
 * Main API Service Layer
 * Abstracts API calls with proper error handling and response normalization
 * 
 * Supports both Mock API (development) and Real API (production)
 * Switch between them using:
 * - Environment variable: REACT_APP_USE_REAL_API=true
 * - Or manually import realApi or mockApi below
 */

// Import both API implementations
import mockApi from './mockApi';
import realApi from './realApi';

// Determine which API to use
// Change this to use realApi when backend is ready
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';
const selectedApiClient = USE_REAL_API ? realApi : mockApi;

class ApiService {
  constructor(apiClient = selectedApiClient) {
    this.api = apiClient;
    console.log(`[API Service] Using ${USE_REAL_API ? 'REAL' : 'MOCK'} API`);
  }

  /**
   * Handle API response
   */
  handleResponse(response) {
    if (!response.success) {
      const error = new Error(response.message || 'An error occurred');
      error.statusCode = response.statusCode;
      error.response = response;
      throw error;
    }
    return response.data || response;
  }

  /**
   * Send OTP to email
   * Flow Step 1: Indicate user's intent to register
   */
  async sendOTP(name, email, studentNumber) {
    try {
      const response = await this.api.sendOTP(name, email, studentNumber);
      return response;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   * Flow Step 2: Confirm email ownership
   */
  async verifyOTP(email, otp) {
    try {
      const response = await this.api.verifyOTP(email, otp);
      return response;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Register user with full details
   * Flow Step 4: Final registration submission
   * 
   * IMPORTANT: OTP must be verified before calling this!
   */
  async registerStudent(formData) {
    try {
      const response = await this.api.registerStudent(formData);
      return response;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Backwards-compatible alias used by existing hooks.
   */
  async registerUser(formData, verificationToken) {
    try {
      if (this.api.registerUser) {
        return await this.api.registerUser(formData, verificationToken);
      }
      return await this.registerStudent(formData);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Payment flow is optional depending on the selected API implementation.
   */
  async initiatePayment(registrationId, amount) {
    try {
      if (this.api.initiatePayment) {
        return await this.api.initiatePayment(registrationId, amount);
      }
      return { success: false, message: 'Payment initiation is not implemented' };
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId) {
    try {
      if (this.api.verifyPayment) {
        return await this.api.verifyPayment(paymentId);
      }
      return { success: false, message: 'Payment verification is not implemented' };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Check if email exists (optional utility)
   */
  async checkEmailExists(email) {
    try {
      if (this.api.checkEmailExists) {
        return await this.api.checkEmailExists(email);
      }
      return { exists: false };
    } catch (error) {
      console.error('Error checking email:', error);
      return { exists: false };
    }
  }

  /**
   * Check if student number exists (optional utility)
   */
  async checkStudentNumberExists(studentNumber) {
    try {
      if (this.api.checkStudentNumberExists) {
        return await this.api.checkStudentNumberExists(studentNumber);
      }
      return { exists: false };
    } catch (error) {
      console.error('Error checking student number:', error);
      return { exists: false };
    }
  }

  /**
   * Get registration details after successful registration
   */
  async getRegistration(registrationId) {
    try {
      if (this.api.getRegistration) {
        return await this.api.getRegistration(registrationId);
      }
      return { success: false, message: 'Not implemented' };
    } catch (error) {
      console.error('Error fetching registration:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export { apiService, ApiService };
export default apiService;
