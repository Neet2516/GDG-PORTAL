/**
 * OTP Verification Page
 * Email verification with OTP
 */

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
  }, [email, sendOTP, navigate, registrationData, setRegistrationData]);

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
      <section className="px-3 pb-16 pt-32 sm:px-4 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <Card className="animate-pulse bg-surface-container-low">
            <div className="h-8 w-48 rounded-xl bg-surface-container-high" />
            <div className="mt-4 h-16 rounded-2xl bg-surface-container-high" />
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="px-3 pb-16 pt-28 sm:px-4 sm:pt-32 md:pt-36">
      <div className="mx-auto grid max-w-5xl gap-6 sm:gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <Card className="h-fit bg-surface">
          <FlowProgress steps={flowSteps} currentStep={1} label="Verification" />
          <div className="mt-6 space-y-4 sm:mt-8">
            <div className="rounded-[1.25rem] bg-surface-container-low p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                Delivery channel
              </p>
              <p className="mt-3 break-all text-sm leading-7 text-on-surface sm:break-normal">
                A one-time code was issued to <span className="font-semibold">{email}</span>.
              </p>
            </div>
            <div className="rounded-[1.25rem] bg-surface-container-lowest p-4 shadow-[0_0_0_1px_rgba(194,198,213,0.18)] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                Dev note
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <CodeChip>otp:length=6</CodeChip>
                <CodeChip>session:active</CodeChip>
                <CodeChip>source:backend</CodeChip>
              </div>
            </div>
          </div>
        </Card>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="relative overflow-hidden bg-surface-container-lowest">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-40 sm:w-40" />
            <div className="relative space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Email checkpoint
                </p>
                <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">Verify your identity before completion.</h1>
                <p className="max-w-xl text-sm leading-7 text-on-surface-variant sm:text-base">
                  This screen is intentionally focused. Enter the 6-digit OTP to continue to the confirmation state.
                </p>
              </div>

              <form onSubmit={handleSubmitOTP} className="space-y-5 sm:space-y-6">
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
                  className="text-center text-xl tracking-[0.28em] sm:text-2xl sm:tracking-[0.4em]"
                />

                <AnimatePresence>
                  {timeRemaining > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-[1.25rem] bg-surface-container-low p-4"
                    >
                      <p className="text-sm text-on-surface-variant">
                        OTP expires in{' '}
                        <span className="font-semibold text-primary">
                          {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                        </span>
                      </p>
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

              <div className="flex flex-col gap-3 rounded-[1.25rem] bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <p className="text-sm leading-6 text-on-surface-variant">
                  Didn&apos;t receive the code? Return and restart the registration flow.
                </p>
                <Button variant="ghost" onClick={() => navigate('/')} className="w-full justify-center sm:w-auto">
                  Go back
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default OTPVerification;
