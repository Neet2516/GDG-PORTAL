import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Input, RadioGroup, Button } from '../components';
import { useFormState } from '../hooks/useFormState';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useRecaptcha } from '../hooks/useRecaptcha';
import { RESIDENCE_TYPES, GENDER_OPTIONS, FORM_DEFAULTS, RECAPTCHA_CONFIG, RAZORPAY_CONFIG } from '../constants';
import { apiService } from '../services/api';
import { normalizePhoneNumber } from '../utils/formatter';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const openRazorpayCheckout = (options) =>
  new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not available'));
      return;
    }

    const razorpay = new window.Razorpay({
      ...options,
      handler: (response) => resolve(response),
    });

    razorpay.on('payment.failed', (error) => {
      reject(new Error(error?.error?.description || 'Payment failed'));
    });

    razorpay.open();
  });

export const RegistrationStep3 = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useSessionStorage('registration_flow', null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha(RECAPTCHA_CONFIG.SITE_KEY);

  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleFieldBlur,
    getFieldError,
    setFieldValue,
  } = useFormState(FORM_DEFAULTS);

  useEffect(() => {
    if (!sessionData?.email || !sessionData?.otpVerified) {
      toast.error('Complete OTP verification first.');
      navigate('/register/verify');
      return;
    }

    if (sessionData.phone) setFieldValue('phone', sessionData.phone);
    if (sessionData.branch) setFieldValue('branch', sessionData.branch);
    if (sessionData.gender) setFieldValue('gender', sessionData.gender);
    if (sessionData.residence) setFieldValue('residence', sessionData.residence);
  }, [navigate, sessionData, setFieldValue]);

  const requiredFields = ['phone', 'branch', 'gender', 'residence'];
  const isStepValid = requiredFields.every((field) => formData[field] && !errors[field]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    requiredFields.forEach((field) => handleFieldBlur(field));
    if (!isStepValid || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load payment checkout');
      }

      const orderResult = await apiService.createOrder({
        email: sessionData.email,
        studentNumber: sessionData.studentNumber,
      });
      if (!orderResult?.success) {
        throw new Error(orderResult?.message || 'Unable to create payment order');
      }

      const order = orderResult.order || orderResult.data?.order;
      if (!order?.id) {
        throw new Error('Invalid order response from backend');
      }

      const razorpayKey = RAZORPAY_CONFIG.KEY_ID;
      if (!razorpayKey) {
        throw new Error('Payment key is missing in environment');
      }

      const paymentResponse = await openRazorpayCheckout({
        key: razorpayKey,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'GDG Program Registration',
        description: 'Program registration fee',
        prefill: {
          name: sessionData.name || '',
          email: sessionData.email || '',
          contact: normalizePhoneNumber(formData.phone || ''),
        },
        theme: {
          color: '#ff3f86',
        },
      });

      const normalizedPhone = normalizePhoneNumber(formData.phone || '');
      const captchaToken =
        RECAPTCHA_CONFIG.ENABLED && RECAPTCHA_CONFIG.SITE_KEY
          ? await executeRecaptcha('register')
          : null;

      const registerPayload = {
        name: sessionData.name,
        email: sessionData.email,
        studentNumber: sessionData.studentNumber,
        phone: normalizedPhone,
        branch: formData.branch,
        gender: formData.gender,
        residence: formData.residence,
        captchaToken: captchaToken || undefined,
        transactionId: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      };

      const registerResult = await apiService.registerStudent(registerPayload);
      if (!registerResult?.success) {
        throw new Error(registerResult?.message || 'Registration failed');
      }

      setSessionData({
        ...sessionData,
        ...registerPayload,
        phone: formData.phone,
        registrationId: registerResult.registrationId,
        completedAt: Date.now(),
      });

      toast.success('Registration successful');
      navigate('/register/success', {
        state: {
          email: sessionData.email,
          verificationToken: sessionData.verificationToken || 'otp_verified',
          name: sessionData.name,
          branch: formData.branch,
          studentNumber: sessionData.studentNumber,
          registrationId: registerResult.registrationId,
        },
      });
    } catch (error) {
      toast.error(error?.message || 'Could not complete registration');
      console.error('Final registration error:', error);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="rounded-[1.5rem] border border-[#18e9ff]/20 bg-[rgba(5,16,18,0.96)] p-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] sm:p-8">
        <div className="space-y-3">
          <p className="font-manrope text-[0.72rem] font-bold uppercase tracking-[0.3em] text-[#18e9ff]">Student Program Registration</p>
          <h1 className="font-pricedown text-3xl text-white sm:text-4xl">COMPLETE REGISTRATION</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/60">Provide your details and pay the program registration fee to confirm your participation.</p>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Step 3 of 4: Details &amp; Payment</h2>
            <p className="text-sm text-[#9ceff2]">75% Complete</p>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/8 sm:max-w-xs">
            <div className="h-full w-[75%] rounded-full bg-[#18e9ff]" />
          </div>
        </div>
      </div>

      {/* ── Program Registration Fee Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[1.5rem] border border-[#ff3f86]/30 bg-[linear-gradient(135deg,rgba(20,6,14,0.97),rgba(8,10,22,0.98))] p-6 shadow-[0_0_0_1px_rgba(255,63,134,0.1),0_24px_60px_-36px_rgba(255,63,134,0.2)] sm:p-8"
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-manrope text-[0.68rem] font-bold uppercase tracking-[0.36em] text-[#ff3f86]">Payment Summary</p>
            <h2 className="mt-1 font-pricedown text-2xl text-white sm:text-3xl">Program Registration Fee</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
              This fee is collected for participation in a structured student program conducted within an institutional setting at Ajay Kumar Garg Engineering College.
              Payments are managed securely and used solely to cover program logistics and participation costs.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-[1rem] border border-white/10 bg-[rgba(255,255,255,0.03)] px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Total Registration Fee</p>
              <p className="mt-1 font-pricedown text-3xl text-white">₹ <span className="text-[#18e9ff]">As applicable</span></p>
            </div>
            <div className="rounded-[0.75rem] border border-[#18e9ff]/25 bg-[rgba(24,233,255,0.05)] px-4 py-2 text-center">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#18e9ff]/70">Non-Refundable</p>
              <p className="text-[0.68rem] text-white/40">Once registration is confirmed</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[0.7rem] text-white/35 font-forresten">
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Secured via Razorpay</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Internal institutional program</span>
            <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Google Developer Groups on Campus AKGEC</span>
          </div>
        </div>
      </motion.div>

      {/* ── Details Form ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[1.5rem] border border-[#18e9ff]/18 bg-[linear-gradient(180deg,rgba(6,22,24,0.96),rgba(5,13,16,0.98))] p-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col justify-center items-center">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleInputChange}
              onBlur={() => handleFieldBlur('phone')}
              error={getFieldError('phone')}
              isTouched={touched.phone}
              placeholder="9876543210"
              required
            />

            <Input
              label="Branch"
              name="branch"
              value={formData.branch || ''}
              onBlur={() => handleFieldBlur('branch')}
              error={getFieldError('branch')}
              isTouched={touched.branch}
              helperText="Detected automatically from the student number entered in step 1."
              required
              readOnly
            />

            <RadioGroup
              label="Gender"
              name="gender"
              value={formData.gender || ''}
              onChange={handleInputChange}
              error={getFieldError('gender')}
              isTouched={touched.gender}
              options={GENDER_OPTIONS.slice(0, 2).map((option) => ({ label: option, value: option })) ?? []}
              required
              direction="horizontal"
            />

            <RadioGroup
              label="Residence"
              name="residence"
              value={formData.residence || ''}
              onChange={handleInputChange}
              error={getFieldError('residence')}
              isTouched={touched.residence}
              options={RESIDENCE_TYPES}
              required
              direction="horizontal"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => navigate('/register/verify')} className="w-full md:w-32">
              Back
            </Button>
            <Button type="submit" disabled={!isStepValid || isSubmitting} isLoading={isSubmitting} className="w-full flex-1 rounded-xl text-base">
              Pay Registration Fee
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationStep3;
