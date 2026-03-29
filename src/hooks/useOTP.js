/**
 * Custom Hook for OTP Handling
 * Manages OTP sending, verification, and timer logic
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { apiService } from '../services/api';
import { RECAPTCHA_CONFIG } from '../constants';
import { useRecaptcha } from './useRecaptcha';

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
  const { executeRecaptcha, isReady: isCaptchaReady, isLoading: isCaptchaLoading } = useRecaptcha(
    RECAPTCHA_CONFIG.SITE_KEY
  );

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

  const sendOTP = useCallback(async (payloadOrEmail) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload =
        typeof payloadOrEmail === 'string'
          ? { email: payloadOrEmail }
          : (payloadOrEmail || {});

      currentEmailRef.current = payload.email;

      const captchaToken =
        RECAPTCHA_CONFIG.ENABLED && RECAPTCHA_CONFIG.SITE_KEY
          ? await executeRecaptcha('send_otp')
          : null;

      if (RECAPTCHA_CONFIG.ENABLED && RECAPTCHA_CONFIG.SITE_KEY && !captchaToken) {
        const errorMessage = 'Captcha is still loading. Please try again in a moment.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const response = await apiService.sendOTP(
        payload.name,
        payload.email,
        payload.studentNumber,
        payload.captchaToken || captchaToken
      );

      if (!response?.success) {
        const errorMessage = response?.message || 'Failed to send OTP';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setCanResend(false);
      setTimeRemaining(120); // 2 minutes
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to send OTP';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [executeRecaptcha]);

  const verifyOTP = useCallback(async (otpValue, emailOverride = '') => {
    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return { success: false };
    }

    const emailToVerify = (emailOverride || currentEmailRef.current || '').trim().toLowerCase();
    if (!emailToVerify) {
      const errorMessage = 'Email not found for OTP verification';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    currentEmailRef.current = emailToVerify;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.verifyOTP(emailToVerify, otpValue);
      if (!response?.success) {
        const errorMessage = response?.message || 'Failed to verify OTP';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setIsVerified(true);
      setVerificationToken(response.verificationToken || 'otp_verified');
      return { success: true, data: response };
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
    isCaptchaReady,
    isCaptchaLoading,
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
