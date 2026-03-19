/**
 * Custom Hook for OTP Handling
 * Manages OTP sending, verification, and timer logic
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

export const useOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const timerRef = useRef(null);
  const currentEmailRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setCanResend(true);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeRemaining]);

  const sendOTP = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);
    currentEmailRef.current = email;

    try {
      await apiService.sendOTP(email);
      setCanResend(false);
      setTimeRemaining(120); // 2 minutes
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (otpValue) => {
    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return { success: false };
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.verifyOTP(currentEmailRef.current, otpValue);
      setIsVerified(true);
      setVerificationToken(data.verificationToken);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to verify OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setOtp('');
    setError(null);
    setIsVerified(false);
    setVerificationToken(null);
    setTimeRemaining(0);
    setCanResend(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    otp,
    setOtp,
    isLoading,
    error,
    isVerified,
    verificationToken,
    timeRemaining,
    canResend,
    sendOTP,
    verifyOTP,
    reset,
  };
};

export default useOTP;
