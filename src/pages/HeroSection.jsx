/**
 * Landing page hero
 */

import { motion } from 'framer-motion';
import { Button, Card, CodeChip } from '../components';
import { EVENT_CONFIG } from '../constants';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const eventMeta = [
  { label: 'Date', value: 'April 15, 2025' },
  { label: 'Time', value: EVENT_CONFIG.eventTime },
  { label: 'Venue', value: EVENT_CONFIG.eventLocation },
];

export const HeroSection = ({ onCtaClick }) => {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-36 md:pb-24 md:pt-40">
      <div className="grid-pattern absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] text-on-surface md:text-7xl">
              A curated registration flow for developers joining the next GDG summit.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-on-surface-variant md:text-xl">
              Calm surfaces, precise metadata, and a guided onboarding sequence for a high-signal event experience.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={onCtaClick}>
              <span>Secure your spot</span>
              <span aria-hidden="true">-&gt;</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Read the brief
            </Button>
          </div>

          <div className="flex flex-wrap gap-6">
            {eventMeta.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-on-surface">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:justify-self-end"
        >
          <Card className="relative overflow-hidden bg-surface-container-low p-5 md:p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            {/* <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                    Event snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold">Developer-first by design</h2>
                </div>
                <CodeChip>status: open</CodeChip>
              </div>

              <div className="space-y-4">
                {[
                  'Editorial multi-step registration',
                  'Email verification flow with OTP checkpoint',
                  'High-clarity attendee metadata and summary state',
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-surface-container-lowest p-4">
                    <p className="text-sm leading-6 text-on-surface">{item}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.25rem] bg-surface-container-lowest p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                  Registration protocol
                </p>
                <div className="mt-4 flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-1.5 flex-1 rounded-full ${step === 3 ? 'bg-surface-container-highest' : 'bg-primary'}`}
                    />
                  ))}
                </div>
                <div className="mt-4 grid gap-3 text-sm text-on-surface-variant">
                  <p><span className="font-semibold text-on-surface">01.</span> Basic identity capture</p>
                  <p><span className="font-semibold text-on-surface">02.</span> Event alignment details</p>
                  <p><span className="font-semibold text-on-surface">03.</span> Confirm and verify email</p>
                </div>
              </div>
            </div> */}
             <DotLottieReact
      src="https://lottie.host/ec33de7b-abc0-407c-ad87-2dabd98d97b7/T2pBWOtr7o.lottie"
      loop
      autoplay
    />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
