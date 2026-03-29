import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Button, Card, CodeChip, FlowProgress, Input } from '../components';
import { useOTP } from '../hooks/useOTP';
import { useSessionStorage } from '../hooks/useSessionStorage';

const flowSteps = [
  { id: 'basic', title: 'Basic info', kicker: 'Step 1', caption: 'Registration payload captured.' },
  { id: 'verify', title: 'Verify identity', kicker: 'Step 2', caption: 'Confirm ownership of the email.' },
  { id: 'done', title: 'Confirmation', kicker: 'Step 3', caption: 'Complete the final success state.' },
];

export const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationData, setRegistrationData] = useSessionStorage('registration_flow', null);
  const email = location.state?.email || registrationData?.email || '';
  const {
    otp,
    setOtp,
    isLoading,
    isCaptchaReady,
    error: otpError,
    isVerified,
    verificationToken,
    timeRemaining,
    canResend,
    sendOTP,
    verifyOTP,
    reset: resetOTP,
  } = useOTP();

  const [isInitializing, setIsInitializing] = useState(true);
  const initializedRef = useRef(false);
  const redirectedRef = useRef(false);

  useEffect(() => {
    const initializeOTP = async () => {
      if (!email) {
        toast.error('Email not found. Please register again.');
        navigate('/register');
        return;
      }

      if (registrationData?.otpSentAt) {
        if (isInitializing) setIsInitializing(false);
        return;
      }

      if (initializedRef.current) {
        if (isInitializing) setIsInitializing(false);
        return;
      }
      initializedRef.current = true;

      if (!isCaptchaReady) {
        initializedRef.current = false;
        return;
      }

      const result = await sendOTP({
        name: registrationData?.name,
        email,
        studentNumber: registrationData?.studentNumber,
      });
      if (result.success) {
        setRegistrationData((prev) => {
          if (prev?.otpSentAt) return prev;
          return {
            ...(prev || {}),
            otpSentAt: Date.now(),
          };
        });
        toast.success('OTP sent to your email');
      } else {
        toast.error(result.error || 'Failed to send OTP');
      }
      setIsInitializing(false);
    };

    initializeOTP();
  }, [email, sendOTP, navigate, registrationData, setRegistrationData, isInitializing, isCaptchaReady]);

  useEffect(() => {
    if (redirectedRef.current) return;
    if (isVerified && verificationToken) {
      const registrationSnapshot = registrationData || {};
      redirectedRef.current = true;
      setRegistrationData((prev) => ({
        ...(prev || {}),
        ...(prev?.otpVerified && prev?.verificationToken === verificationToken
          ? {}
          : {
              otpVerified: true,
              verificationToken,
            }),
      }));
      navigate('/register/payment', {
        state: {
          email,
          verificationToken,
          ...registrationSnapshot,
        },
      });
    }
  }, [isVerified, verificationToken, navigate, email, registrationData, setRegistrationData]);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    const result = await verifyOTP(otp, email);
    if (!result.success) {
      toast.error(result.error || 'Verification failed');
    }
  };

  const handleResendOTP = async () => {
    resetOTP();
    const result = await sendOTP({
      name: registrationData?.name,
      email,
      studentNumber: registrationData?.studentNumber,
    });
    if (result.success) {
      setRegistrationData((prev) => ({
        ...(prev || {}),
        otpSentAt: Date.now(),
      }));
      toast.success('OTP sent again');
    } else {
      toast.error(result.error || 'Failed to resend OTP');
    }
  };

  if (isInitializing) {
    return (
      <section className="mx-auto grid min-h-[60vh] max-w-6xl place-items-center px-4">
        <Card className="w-full max-w-3xl animate-pulse">
          <div className="h-8 w-52 rounded-full bg-white/10" />
          <div className="mt-6 h-32 rounded-2xl bg-white/5" />
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto grid max-w-6xl place-items-center px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Card className="relative w-full overflow-hidden">
          <div className="pointer-events-none absolute right-8 top-8 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-manrope text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#18e9ff]">
                Email checkpoint
              </p>
              <h1 className="max-w-full font-pricedown text-3xl text-white sm:text-4xl">
                Verify your identity before completion.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/60">
                This screen is intentionally focused. Enter the 6-digit OTP to continue to the confirmation state.
              </p>
            </div>

            <form onSubmit={handleSubmitOTP} className="space-y-5">
              <Input
                label="Enter 6-digit OTP"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={otpError}
                isTouched={!!otpError}
                placeholder="000000"
                required
              />

              <AnimatePresence>
                {timeRemaining > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-white/65"
                  >
                    OTP expires in{' '}
                    <span className="font-semibold text-[#18e9ff]">
                      {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={otp.length !== 6 || isLoading} isLoading={isLoading} className="w-full sm:flex-1">
                  Verify OTP
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!canResend || isLoading}
                  onClick={handleResendOTP}
                  className="w-full sm:flex-1"
                >
                  {canResend ? 'Resend OTP' : `Resend in ${timeRemaining}s`}
                </Button>
              </div>
            </form>

            <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/60">Didn&apos;t receive the code? Return and restart the registration flow.</p>
              <Button variant="ghost" onClick={() => navigate('/')} className="w-full justify-center sm:w-auto">
                Go back
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default OTPVerification;
