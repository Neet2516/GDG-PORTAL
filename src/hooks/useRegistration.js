/**
 * Custom Hook for Registration Management
 * Handles complete registration workflow
 */

import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useRegistration = () => {
  const [registrationId, setRegistrationId] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('form'); // form, otp, payment, success

  const registerUser = useCallback(async (formData, verificationToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.registerUser(formData, verificationToken);
      setRegistrationId(data.registrationId);
      setRegistrationData(data.registration);
      setStep('payment');
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initiatePayment = useCallback(async (amount = 0) => {
    if (!registrationId) {
      setError('No registration found');
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.initiatePayment(registrationId, amount);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Payment initiation failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [registrationId]);

  const verifyPayment = useCallback(async (paymentId) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.verifyPayment(paymentId);
      setStep('success');
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Payment verification failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRegistrationDetails = useCallback(async (regId = registrationId) => {
    if (!regId) return { success: false };

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.getRegistration(regId);
      setRegistrationData(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch registration details';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [registrationId]);

  const reset = useCallback(() => {
    setRegistrationId(null);
    setRegistrationData(null);
    setError(null);
    setStep('form');
  }, []);

  return {
    registrationId,
    registrationData,
    isLoading,
    error,
    step,
    setStep,
    registerUser,
    initiatePayment,
    verifyPayment,
    getRegistrationDetails,
    reset,
  };
};

export default useRegistration;
