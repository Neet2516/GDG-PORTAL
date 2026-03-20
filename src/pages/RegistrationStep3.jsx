import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Input, Select, RadioGroup, Button } from '../components';
import { useFormState } from '../hooks/useFormState';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useRecaptcha } from '../hooks/useRecaptcha';
import { USER_BRANCHES, RESIDENCE_TYPES, GENDER_OPTIONS, FORM_DEFAULTS, RECAPTCHA_CONFIG, RAZORPAY_CONFIG } from '../constants';
import { apiService } from '../services/api';

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
        throw new Error('Unable to load Razorpay checkout');
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
        throw new Error('Razorpay key is missing in environment');
      }

      const paymentResponse = await openRazorpayCheckout({
        key: razorpayKey,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'GDG Registration',
        description: 'Event registration payment',
        prefill: {
          name: sessionData.name || '',
          email: sessionData.email || '',
          contact: formData.phone || '',
        },
        theme: {
          color: '#0058bd',
        },
      });

      const captchaToken =
        RECAPTCHA_CONFIG.ENABLED && RECAPTCHA_CONFIG.SITE_KEY
          ? await executeRecaptcha('register')
          : null;

      const registerPayload = {
        name: sessionData.name,
        email: sessionData.email,
        studentNumber: sessionData.studentNumber,
        phone: formData.phone,
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
    <div className="max-w-[720px] mx-auto w-full pt-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#1a1c1e] font-manrope mb-3">Complete Registration</h1>
        <p className="text-base text-[#424753] max-w-md mx-auto leading-relaxed">
          Add your final details and finish the secure payment checkout.
        </p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-2 px-2">
        <h2 className="text-xs font-bold tracking-widest text-[#0058bd] uppercase">Step 3 of 4: Details & Payment</h2>
        <p className="text-xs font-semibold text-[#1a1c1e]">75% Complete</p>
      </div>
      <div className="flex gap-1 w-full bg-[#e8e8ea] h-[3px] overflow-hidden mb-12">
        <div className="w-[75%] bg-[#0058bd] h-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#f1f1f4]"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
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
            className="bg-[#f3f3f6] border-0"
          />

          <Select
            label="Branch"
            name="branch"
            value={formData.branch || ''}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('branch')}
            error={getFieldError('branch')}
            isTouched={touched.branch}
            options={USER_BRANCHES.map((b) => ({ label: b, value: b }))}
            required
            className="bg-[#f3f3f6] border-0"
          />

          <RadioGroup
            label="Gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleInputChange}
            error={getFieldError('gender')}
            isTouched={touched.gender}
            options={GENDER_OPTIONS.slice(0, 2).map((option) => ({ label: option, value: option }))}
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

          <div className="pt-2 flex flex-col md:flex-row gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/register/verify')} className="md:w-32">
              Back
            </Button>
            <Button type="submit" disabled={!isStepValid || isSubmitting} isLoading={isSubmitting} className="flex-1 text-base rounded-xl">
              Pay & Register
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationStep3;
