/**
 * Registration form page
 * Main registration form with validation
 */

import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { Input, Select, RadioGroup, Button, Card, FlowProgress, CodeChip } from '../components';
import { useFormState } from '../hooks/useFormState';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { USER_BRANCHES, RESIDENCE_TYPES, GENDER_OPTIONS, FORM_DEFAULTS, EVENT_CONFIG } from '../constants/index';

const flowSteps = [
  { id: 'basic', title: 'Basic info', kicker: 'Step 1', caption: 'Identity, email, and student context.' },
  { id: 'event', title: 'Event details', kicker: 'Step 2', caption: 'Academic and attendance metadata.' },
  { id: 'confirm', title: 'Confirmation', kicker: 'Step 3', caption: 'Review before moving to OTP verification.' },
];

const stepFields = {
  0: ['name', 'email', 'phone', 'studentNumber'],
  1: ['branch', 'gender', 'residence'],
};

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    errors,
    touched,
    isValid,
    handleInputChange,
    handleFieldBlur,
    getFieldError,
  } = useFormState(FORM_DEFAULTS);

  const [, setSessionData] = useSessionStorage('registration_flow', null);
  const isSubmittingRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);

  const validateStep = (stepIndex) => {
    const fields = stepFields[stepIndex] || [];
    fields.forEach((field) => handleFieldBlur(field));
    return fields.every((field) => formData[field] && !errors[field]);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, flowSteps.length - 1));
    }
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid || isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    try {
      setSessionData({
        ...formData,
        timestamp: Date.now(),
      });

      navigate('/verify-otp', { state: { email: formData.email } });
      toast.success('Proceeding to email verification');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <section id="register-section" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-surface-container-low px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <Card className="h-fit bg-surface">
            <FlowProgress steps={flowSteps} currentStep={currentStep} label="Registration" />

            <div className="mt-8 space-y-5">
              <div className="rounded-[1.25rem] bg-surface-container-low p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                  Event handle
                </p>
                <h3 className="mt-2 text-xl font-extrabold text-on-surface">{EVENT_CONFIG.eventName}</h3>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{EVENT_CONFIG.description}</p>
              </div>

              <div className="rounded-[1.25rem] bg-surface-container-lowest p-5 shadow-[0_0_0_1px_rgba(194,198,213,0.18)]">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                  Registration metadata
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <CodeChip>fee:{EVENT_CONFIG.registrationFee === 0 ? 'free' : EVENT_CONFIG.registrationFee}</CodeChip>
                  <CodeChip>otp:required</CodeChip>
                  <CodeChip>campus:AKGEC</CodeChip>
                </div>
              </div>

              <div className="rounded-[1.25rem] bg-surface-container-low p-5">
                <p className="text-sm font-semibold text-on-surface">Flow notes</p>
                <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <p>1. Enter details carefully. Validation remains unchanged.</p>
                  <p>2. Review the summary before requesting your email OTP.</p>
                  <p>3. Confirmation is completed after successful verification.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden bg-surface-container-lowest">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Guided editorial journey
                </p>
                <h2 className="max-w-2xl text-balance text-3xl font-extrabold md:text-4xl">
                  Register with a multi-step flow instead of a single crowded sheet.
                </h2>
                <p className="max-w-2xl text-base leading-7 text-on-surface-variant">
                  The submission logic, validation, and backend integration remain intact. Only the UI sequence has changed.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-basic"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('name')}
                        error={getFieldError('name')}
                        isTouched={touched.name}
                        placeholder="John Doe"
                        required
                      />
                      <Input
                        label="College Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('email')}
                        error={getFieldError('email')}
                        isTouched={touched.email}
                        placeholder="john25xxxx@akgec.ac.in"
                        helperText="We'll send a verification code here."
                        required
                      />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('phone')}
                        error={getFieldError('phone')}
                        isTouched={touched.phone}
                        placeholder="9876543210"
                        required
                      />
                      <Input
                        label="Student Number"
                        name="studentNumber"
                        value={formData.studentNumber}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('studentNumber')}
                        error={getFieldError('studentNumber')}
                        isTouched={touched.studentNumber}
                        placeholder="25XXXXX"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step-event"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <Select
                        label="Branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        onBlur={() => handleFieldBlur('branch')}
                        error={getFieldError('branch')}
                        isTouched={touched.branch}
                        options={USER_BRANCHES.map((branch) => ({ label: branch, value: branch }))}
                        required
                      />
                      <div className="rounded-[1.25rem] bg-surface-container-low p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                          Event status
                        </p>
                        <p className="mt-3 text-base font-semibold text-on-surface">Open for student registrations</p>
                        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                          This stage captures academic and attendee metadata only. No business rules were altered.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <RadioGroup
                        label="Gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        error={getFieldError('gender')}
                        isTouched={touched.gender}
                        options={GENDER_OPTIONS.map((option) => ({ label: option.replaceAll('_', ' '), value: option }))}
                        required
                        direction="vertical"
                      />
                      <RadioGroup
                        label="Residence"
                        name="residence"
                        value={formData.residence}
                        onChange={handleInputChange}
                        error={getFieldError('residence')}
                        isTouched={touched.residence}
                        options={RESIDENCE_TYPES}
                        required
                        direction="vertical"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-confirm"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="rounded-[1.5rem] bg-surface-container-low p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                        Confirmation summary
                      </p>
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        {[
                          ['Name', formData.name],
                          ['Email', formData.email],
                          ['Phone', formData.phone],
                          ['Student Number', formData.studentNumber],
                          ['Branch', formData.branch],
                          ['Gender', formData.gender?.replaceAll('_', ' ')],
                          ['Residence', formData.residence],
                        ].map(([label, value]) => (
                          <div key={label} className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                              {label}
                            </p>
                            <p className="text-sm font-semibold text-on-surface">{value || 'Not provided'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.25rem] bg-surface-container-lowest p-5 shadow-[0_0_0_1px_rgba(194,198,213,0.18)]">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                        Next step
                      </p>
                      <p className="mt-3 text-sm leading-6 text-on-surface-variant">
                        Continue to OTP verification. The same email verification route and session payload will be used.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3 border-0 pt-2 sm:flex-row sm:justify-between">
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <Button type="button" variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  {currentStep < flowSteps.length - 1 ? (
                    <Button type="button" onClick={handleNext}>
                      <span>Continue</span>
                      <span aria-hidden="true">-&gt;</span>
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!isValid} isLoading={isSubmittingRef.current}>
                      <span>Continue to verification</span>
                      <span aria-hidden="true">-&gt;</span>
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
