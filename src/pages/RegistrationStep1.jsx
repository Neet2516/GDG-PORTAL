import { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Input, Button } from '../components';
import { useFormState } from '../hooks/useFormState';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FORM_DEFAULTS } from '../constants';
import { useOTP } from '../hooks/useOTP';
import { deriveBranchFromStudentNumber, deriveEmailFromNameAndStudentNumber } from '../utils/registrationDerivation';

export const RegistrationStep1 = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    errors,
    touched,
    handleInputChange,
    handleFieldBlur,
    getFieldError,
  } = useFormState(FORM_DEFAULTS);

  const [, setSessionData] = useSessionStorage('registration_flow', null);
  const isSubmittingRef = useRef(false);
  const { sendOTP } = useOTP();
  const requiredFields = ['name', 'email', 'studentNumber', 'branch'];
  const isStepValid = requiredFields.every((field) => formData[field] && !errors[field]);

  const generatedEmail = useMemo(
    () => deriveEmailFromNameAndStudentNumber(formData.name, formData.studentNumber),
    [formData.name, formData.studentNumber]
  );

  const detectedBranch = useMemo(
    () => deriveBranchFromStudentNumber(formData.studentNumber),
    [formData.studentNumber]
  );

  useEffect(() => {
    setFormData((prev) => {
      if (prev.email === generatedEmail && prev.branch === detectedBranch) {
        return prev;
      }

      return {
        ...prev,
        email: generatedEmail,
        branch: detectedBranch,
      };
    });
  }, [detectedBranch, generatedEmail, setFormData]);

  const validateStep = () => {
    requiredFields.forEach((field) => handleFieldBlur(field));
    return requiredFields.every((field) => formData[field] && !errors[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep() || isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    try {
      const result = await sendOTP({
        name: formData.name,
        email: formData.email,
        studentNumber: formData.studentNumber,
      });
      if (result.success) {
        setSessionData({
          name: formData.name,
          email: formData.email,
          studentNumber: formData.studentNumber,
          branch: formData.branch,
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
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 rounded-[1.5rem] border border-[#18e9ff]/35 bg-[radial-gradient(circle_at_left,rgba(18,35,46,0.98),rgba(4,10,16,0.98))] p-6 shadow-[0_0_0_1px_rgba(24,233,255,0.08),0_24px_70px_-44px_rgba(0,0,0,0.92)] sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-manrope text-[0.72rem] font-bold uppercase tracking-[0.3em] text-[#18e9ff]">Registration</p>
            <h1 className="mt-2 font-pricedown text-3xl text-white sm:text-4xl">ACCESS TERMINAL</h1>
          </div>

          <div className="space-y-2 sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Step 1 of 4</p>
            <p className="text-sm font-semibold text-[#9ceff2]">Basic Info</p>
            <div className="h-2 w-56 overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-1/4 rounded-full bg-[#18e9ff]" />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-[1.5rem] border border-[#18e9ff]/18 bg-[linear-gradient(180deg,rgba(6,22,24,0.96),rgba(5,13,16,0.98))] p-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] sm:p-8"
      >
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Full Name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('name')}
            error={getFieldError('name')}
            isTouched={touched.name}
            placeholder="Aryan"
            required
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
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email || ''}
            onBlur={() => handleFieldBlur('email')}
            error={getFieldError('email')}
            isTouched={touched.email}
            placeholder="hacker@example.com"
            helperText={
              generatedEmail
                ? 'Generated automatically as firstname+studentnumber@akgec.ac.in.'
                : 'Enter your name and student number to generate your college email.'
            }
            required
            readOnly
          />
          <Input
            label="Branch"
            name="branch"
            value={formData.branch || ''}
            onBlur={() => handleFieldBlur('branch')}
            error={getFieldError('branch')}
            isTouched={touched.branch}
            placeholder="Detected from your student number"
            helperText={
              detectedBranch
                ? 'Detected automatically from your branch code.'
                : 'Branch will be detected automatically from the student number.'
            }
            required
            readOnly
          />

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={!isStepValid}
              isLoading={isSubmittingRef.current}
              className="w-full justify-between rounded-xl px-6 py-4 text-base"
            >
              <span>Send OTP</span>
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </form>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-[1.2rem] border border-[#18e9ff]/18 bg-[rgba(8,20,22,0.92)] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#18e9ff]/25 bg-[rgba(24,233,255,0.08)] text-[#18e9ff]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Secure Verification</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">Your data is encrypted and used only for GDG event management.</p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-[1.2rem] border border-[#18e9ff]/18 bg-[rgba(8,20,22,0.92)] p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#18e9ff]/25 bg-[rgba(24,233,255,0.08)] text-[#18e9ff]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 16l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">Meridian Chapters</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">Join a community of 500+ developers in the Meridian region.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep1;
