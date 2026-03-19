import axios from 'axios';

/**
 * Configure Axios with base URL and common headers.
 */
const api = axios.create({
  baseURL: 'https://api.akgec-society.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registrationService = {
  /**
   * Submits form data and retrieves a Razorpay order from the backend.
   */
  createRegistrationOrder: async (data) => {
    // In JS, 'data' is implicitly 'any', so ensure the object 
    // passed matches what the Django backend expects.
    return api.post('/registration/create-order/', data);
  },

  /**
   * Verifies the payment signature returned by Razorpay on the backend.
   */
  verifyPayment: async (paymentData) => {
    // paymentData will be the object containing:
    // razorpay_payment_id, razorpay_order_id, razorpay_signature
    return api.post('/registration/verify-payment/', paymentData);
  }
};

export default api;