/**
 * Registration success page
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Button, Card, CodeChip, FlowProgress } from '../components';

const flowSteps = [
  { id: 'basic', title: 'Basic info', kicker: 'Step 1', caption: 'Registration payload captured.' },
  { id: 'verify', title: 'Verify identity', kicker: 'Step 2', caption: 'Email ownership confirmed.' },
  { id: 'done', title: 'Confirmation', kicker: 'Step 3', caption: 'Your registration is complete.' },
];

export const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = '', verificationToken = '', ...userData } = location.state || {};

  useEffect(() => {
    if (!verificationToken) {
      navigate('/');
    }
  }, [verificationToken, navigate]);

  return (
    <section className="px-4 pb-16 pt-32 md:pt-36">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <Card className="h-fit bg-surface">
          <FlowProgress steps={flowSteps} currentStep={2} label="Complete" />
          <div className="mt-8 space-y-4">
            <div className="rounded-[1.25rem] bg-surface-container-low p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                Confirmation status
              </p>
              <p className="mt-3 text-sm leading-7 text-on-surface">
                Your email verification token was accepted and the attendee flow is complete.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CodeChip>state:registered</CodeChip>
              <CodeChip>channel:email</CodeChip>
              <CodeChip>portal:gdg-meridian</CodeChip>
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Card className="relative overflow-hidden bg-surface-container-lowest">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative space-y-8">
              <div className="space-y-4">
                <div className="primary-gradient flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold uppercase tracking-[0.2em] text-on-primary">
                  OK
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Registration successful
                  </p>
                  <h1 className="text-3xl font-extrabold md:text-4xl">
                    Your spot is secured.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-on-surface-variant">
                    You&apos;re confirmed for the event. The experience is complete, and a confirmation email should now be on its way.
                  </p>
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-surface-container-low p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                  Registration summary
                </p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {[
                    ['Attendee', userData.name],
                    ['Email', email],
                    ['Branch', userData.branch],
                    ['Student Number', userData.studentNumber],
                  ].map(([label, value]) => (
                    <div key={label} className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-on-surface">{value || 'Not available'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1" onClick={() => navigate('/')}>
                  Back to home
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    window.location.href = 'mailto:gdg@example.com';
                  }}
                >
                  Contact support
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default RegistrationSuccess;
