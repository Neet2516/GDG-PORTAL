import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Input, Button } from '../components';
import { useFormState } from '../hooks/useFormState';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FORM_DEFAULTS } from '../constants';
import { useOTP } from '../hooks/useOTP';

export const RegistrationStep1 = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    touched,
    handleInputChange,
    handleFieldBlur,
    getFieldError,
  } = useFormState(FORM_DEFAULTS);

  const [, setSessionData] = useSessionStorage('registration_flow', null);
  const isSubmittingRef = useRef(false);
  const { sendOTP } = useOTP();
  const requiredFields = ['name', 'email', 'studentNumber'];
  const isStepValid = requiredFields.every((field) => formData[field] && !errors[field]);

  const validateStep = () => {
    requiredFields.forEach((field) => handleFieldBlur(field));
    return requiredFields.every((field) => formData[field] && !errors[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep() || isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    try {
      // Step 1 only requires name, email, studentNumber
      const result = await sendOTP({
        name: formData.name,
        email: formData.email,
        studentNumber: formData.studentNumber,
      });
      console.log(result);
      if (result.success) {
        setSessionData({
          name: formData.name,
          email: formData.email,
          studentNumber: formData.studentNumber,
          otpSentAt: Date.now(),
          timestamp: Date.now(),
        });
        toast.success('OTP sent to your email');
        navigate('/register/verify', { state: { email: formData.email } });
      } else {
        toast.error(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full pt-8">
      {/* Title section above the card */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end justify-center items-center px-2">
        <div>
          <h2 className="text-xs font-bold tracking-widest text-[#0058bd] uppercase mb-2">Registration</h2>
          <h1 className="text-4xl font-extrabold text-[#1a1c1e] font-manrope">Basic Information</h1>
        </div>
        <div className="text-right flex flex-col md:items-end items-center">
          <p className="text-sm font-semibold text-[#1a1c1e] mb-2">Step 1 of 4</p>
          <p className="text-xs font-bold text-[#0058bd]">Basic Info</p>
          <div className="flex gap-1 mt-2 w-48 bg-[#e8e8ea] h-1.5 rounded-full overflow-hidden">
             <div className="w-1/4 bg-[#0058bd] h-full" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#f1f1f4]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('name')}
            error={getFieldError('name')}
            isTouched={touched.name}
            placeholder="Sidney Swinny"
            required
            className="bg-[#f3f3f6] border-0 outline-none"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('email')}
            error={getFieldError('email')}
            isTouched={touched.email}
            placeholder="[EMAIL_ADDRESS]"
            helperText="We'll send a verification code to this address."
            required
            className="bg-[#f3f3f6] border-0 outline-none"
          />
          <Input
            label="Student Number"
            name="studentNumber"
            value={formData.studentNumber || ''}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('studentNumber')}
            error={getFieldError('studentNumber')}
            isTouched={touched.studentNumber}
            placeholder="25xxxxxx"
            required
            className="bg-[#f3f3f6] border-0 outline-none"
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={!isStepValid}
              isLoading={isSubmittingRef.current}
              className="w-full text-base py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <span>Send OTP</span>
              <span>→</span>
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#f3f3f6] rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-[#d8e2ff] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#0058bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#0058bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#1a1c1e] mb-1">Secure Verification</h3>
            <p className="text-xs text-[#424753] leading-relaxed">Your data is encrypted and used only for GDG event management.</p>
          </div>
        </div>

        <div className="bg-[#f3f3f6] rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-[#d8e2ff] w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#0058bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#0058bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 16l2 2 4-4" stroke="#0058bd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#1a1c1e] mb-1">Meridian Chapters</h3>
            <p className="text-xs text-[#424753] leading-relaxed">Join a community of 500+ developers in the Meridian region.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep1;
