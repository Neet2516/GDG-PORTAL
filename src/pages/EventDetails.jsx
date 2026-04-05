import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  FiAward,
  FiBookOpen,
  FiGift,
  FiMinus,
  FiPlus,
  FiRadio,
  FiShield,
  FiTarget,
  FiUnlock,
  FiStar,
  FiCheckCircle,
  FiUsers,
  FiClock,
} from 'react-icons/fi';
import { TfiGame } from "react-icons/tfi";
import { FaTrophy } from "react-icons/fa";
import backgroundImage from '../assets/images/landingpage-background.jpg';

const programModules = [
  {
    number: '01',
    title: 'ORIENTATION & SETUP',
    subtitle: 'Introduction & Environment Setup',
    tag: 'OPEN',
    icon: FiUnlock,
    accent: 'cyan',
    muted: false,
    stars: 1,
  },
  {
    number: '02',
    title: 'TECHNICAL SESSION',
    subtitle: 'Core Concepts & Hands-on Learning',
    tag: 'SCHEDULED',
    icon: FiBookOpen,
    accent: 'pink',
    muted: true,
    stars: 2,
  },
  {
    number: '03',
    title: 'PRACTICAL WORKSHOP',
    subtitle: 'Guided Implementation Activity',
    tag: 'SCHEDULED',
    icon: FiTarget,
    accent: 'pink',
    muted: true,
    stars: 3,
  },
  {
    number: '04',
    title: 'COLLABORATIVE BUILD',
    subtitle: 'Group Problem Solving & Collaboration',
    tag: 'SCHEDULED',
    icon: FiUsers,
    accent: 'pink',
    muted: true,
    stars: 4,
  },
  {
    number: '05',
    title: 'FINAL ASSESSMENT',
    subtitle: 'Program Completion & Recognition',
    tag: 'TOP PARTICIPANTS',
    icon: FiShield,
    accent: 'violet',
    muted: false,
    stars: 5,
  },
];

const benefits = [
  {
    title: 'ALL PARTICIPANTS',
    description: 'Keychains + Exclusive Stickers',
    icon: FiGift,
    accent: 'amber',
  },
  {
    title: 'TOP PERFORMERS',
    description: 'Goodies + Recognition',
    detail: 'Priority Access',
    icon: FaTrophy,
    accent: 'gold',
    featured: true,
  },
  {
    title: 'CERTIFICATE',
    description: 'Participation Certificate',
    icon: FiAward,
    accent: 'silver',
  },
];

const benefitCardStyles = {
  silver: {
    border: 'border-white/45',
    glow: 'shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_50px_-28px_rgba(255,255,255,0.35)]',
    panel: 'bg-[linear-gradient(180deg,rgba(11,12,24,0.94),rgba(7,8,18,0.98))]',
    icon: 'border-white/55 bg-[rgba(255,255,255,0.03)] text-white/90',
    title: 'text-white',
    titleGlow: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]',
    body: 'text-white/74',
    detail: 'text-white/55',
  },
  gold: {
    border: 'border-[#f2b400]/80',
    glow: 'shadow-[0_0_0_1px_rgba(242,180,0,0.2),0_24px_70px_-24px_rgba(242,180,0,0.55)]',
    panel: 'bg-[radial-gradient(circle_at_top,rgba(255,210,89,0.26),rgba(45,31,10,0.9)_42%,rgba(8,9,18,0.98)_100%)]',
    icon: 'border-[#ffcc4d]/75 bg-[rgba(255,198,46,0.14)] text-[#ffe08b]',
    title: 'text-[#ffc629]',
    titleGlow: 'drop-shadow-[0_0_16px_rgba(255,198,41,0.45)]',
    body: 'text-[#f4d79b]',
    detail: 'text-[#f8e7bc]/75',
  },
  amber: {
    border: 'border-[#ff9900]/75',
    glow: 'shadow-[0_0_0_1px_rgba(255,153,0,0.16),0_20px_54px_-28px_rgba(255,153,0,0.42)]',
    panel: 'bg-[linear-gradient(180deg,rgba(13,11,24,0.94),rgba(7,8,18,0.98))]',
    icon: 'border-[#ffad33]/65 bg-[rgba(255,153,0,0.08)] text-[#ffb84f]',
    title: 'text-[#ffd38a]',
    titleGlow: 'drop-shadow-[0_0_14px_rgba(255,171,54,0.32)]',
    body: 'text-white/74',
    detail: 'text-white/55',
  },
};

const useScrollStop = (delay = 40) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, delay);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  return isScrolling;
};

const BenefitRevealCard = ({ benefit, index, isScrolling }) => {
  const prefersReducedMotion = useReducedMotion();
  const benefitStyle = benefitCardStyles[benefit.accent];
  const showContent = !isScrolling || prefersReducedMotion;

  return (
    <article
      key={benefit.title}
      className={`group relative w-full overflow-hidden rounded-[1.65rem] border p-6 text-center ${benefitStyle.border} ${benefitStyle.panel} ${benefitStyle.glow} ${benefit.featured
        ? 'max-w-[30rem] min-h-[28rem] lg:w-[34%] lg:max-w-none lg:min-h-[31rem]'
        : 'max-w-[27rem] min-h-[22rem] lg:w-[28%] lg:max-w-none lg:min-h-[25rem]'
        } transition-transform duration-300 hover:-translate-y-1`}
      style={{ perspective: '1200px' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)] opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

      <motion.div
        className="relative flex h-full flex-col items-center justify-center gap-5 px-3 py-4 sm:px-4 sm:py-6"
        initial={false}
        animate={
          showContent
            ? { rotateY: 0, opacity: 1, scale: 1, y: 0 }
            : { rotateY: 90, opacity: 0.15, scale: 0.96, y: 4 }
        }
        transition={{
          duration: prefersReducedMotion ? 0.15 : 0.65,
          delay: index * 0.01,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
      >
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full border text-[2rem] sm:h-24 sm:w-24 sm:text-[2.25rem] ${benefit.featured ? 'scale-110 sm:scale-125' : ''
            } ${benefitStyle.icon}`}
        >
          <benefit.icon />
        </div>

        <h3
          className={`mt-7 font-pricedown text-[1.95rem] uppercase leading-none sm:text-[2.25rem] !tracking-wider ${benefit.featured ? 'sm:text-[2.45rem]' : ''
            } ${benefitStyle.title} ${benefitStyle.titleGlow}`}
        >
          {benefit.title}
        </h3>
        {benefit.detail ? (
          <div
            className={`mt-5 inline-flex items-center rounded-full border border-[#ffcc4d]/35 bg-[rgba(255,191,29,0.08)] px-4 py-2 font-forresten text-2xl font-semibold !tracking-wider ${benefitStyle.detail} text-white`}
          >
            {benefit.detail}
          </div>
        ) : null}

        <p
          className={`mt-4 font-forresten text-base font-medium sm:text-lg ${benefit.featured ? 'sm:text-xl' : ''} ${benefitStyle.body} !text-green-500`}
        >
          {benefit.description}
        </p>
      </motion.div>
    </article>
  );
};

const faqItems = [
  {
    question: 'WHO IS ELIGIBLE TO PARTICIPATE?',
    answer:
      'This program is open exclusively to registered students of Ajay Kumar Garg Engineering College. Participation is limited to enrolled students and subject to eligibility criteria defined by the organizers.',
  },
  {
    question: 'IS THE REGISTRATION FEE REFUNDABLE?',
    answer:
      'All payments made are final and non-refundable. Refunds will only be issued if the program is cancelled by the organizers. Please ensure your participation before completing payment.',
  },
  {
    question: 'WHAT INFORMATION IS COLLECTED DURING REGISTRATION?',
    answer:
      'We collect basic information such as your name, student number, email address, and contact details solely for the purpose of program registration and communication. This data is not shared with any third parties.',
  },
  {
    question: 'HOW WILL I RECEIVE PROGRAM UPDATES?',
    answer:
      'All confirmations and updates will be sent to your registered college email address. Please keep a record of your payment confirmation for reference during the program.',
  },
];

const dayCards = [
  {
    day: 'DAY 01',
    date: '6TH APRIL',
    title: 'Technical Learning Session',
    time: '2:00 PM - 5:00 PM',
    icon: FiBookOpen,
    tone: 'cyan',
    code: '[ SYS.OK ]',
  },
  {
    day: 'DAY 02',
    date: '7TH APRIL',
    title: 'Hands-On Activity',
    time: '2:00 PM ONWARDS',
    icon: TfiGame,
    tone: 'pink',
    code: '[ EXECUTING ]',
  },
];

const sectionMotion = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

export const EventDetails = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const isScrolling = useScrollStop(150);
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-[#070814] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-20">
        {/* ── INSTITUTIONAL TRUST SIGNAL ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[1.4rem] border border-[#18e9ff]/20 bg-[linear-gradient(135deg,rgba(4,14,22,0.98),rgba(6,10,20,0.98))] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex-1 space-y-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.36em] text-[#18e9ff]/60">Institutional Notice</p>
              <p className="text-[0.97rem] leading-[1.75] text-white/72 font-chalet">
                This platform is operated to facilitate student registrations for academic and co-curricular programs
                conducted within an institutional environment at{' '}
                <span className="font-semibold text-white/90">Ajay Kumar Garg Engineering College</span>.
                It is a non-commercial, student-led initiative managed by{' '}
                <span className="font-semibold text-[#18e9ff]">Google Developer Groups on Campus AKGEC</span>.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end shrink-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#18e9ff]/30 bg-[rgba(24,233,255,0.06)] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#18e9ff]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#18e9ff]" /> Official Portal
              </span>
              <span className="text-[0.7rem] text-white/35 uppercase tracking-[0.2em]">AKGEC · GDG on Campus</span>
            </div>
          </div>
        </motion.div>

        {/* ABOUT / Program Overview */}
        <motion.section id="program" className="space-y-8" {...sectionMotion}>

          <div className="rounded-[1.6rem] border border-[#6b11ff]/60 bg-[linear-gradient(180deg,rgba(16,8,30,0.98),rgba(8,8,20,0.98))] p-6 shadow-[0_0_0_1px_rgba(123,33,255,0.16),0_0_48px_rgba(123,33,255,0.18)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.72fr] lg:items-center">
              <div className="space-y-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#9f4dff] hidden md:block">
                  &gt;&gt; program.info
                </p>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full text-[#8f26ff] shadow-[0_0_0_1px_rgba(143,38,255,0.32),0_0_24px_rgba(143,38,255,0.22)]">
                    <FiRadio size={36} />
                  </div>
                  <h2 className="font-pricedown text-3xl sm:text-4xl text-black text-stroke-white">
                    ABOUT THE PROGRAM
                  </h2>
                </div>

                <p className="max-w-3xl text-md md:text-[1.5rem] leading-7 text-white sm:text-base font-chalet">
                  This platform is used to manage registrations for student programs, workshops, and technical
                  activities conducted within Ajay Kumar Garg Engineering College. Participants can submit their
                  details and complete registration by paying a participation fee for the selected program.{' '}
                  <span className="font-semibold text-[#ff356d]">Seats are limited — register now.</span>
                </p>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="flex h-60 w-60 items-center justify-center rounded-full border border-[#6b11ff]/60 bg-[radial-gradient(circle_at_center,rgba(255,79,159,0.22),rgba(10,10,24,0.86))] shadow-[0_0_0_1px_rgba(123,33,255,0.15),0_0_36px_rgba(123,33,255,0.22)]">
                  <div
                    className="h-48 w-48 rounded-full border border-[#8f26ff]/30 bg-cover bg-center bg-no-repeat shadow-[inset_0_0_60px_rgba(0,0,0,0.35)]"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Day Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {dayCards.map((card) => {
              const Icon = card.icon;
              const isCyan = card.tone === 'cyan';

              return (
                <article
                  key={card.day}
                  className={`rounded-[1.35rem] border p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] ${isCyan
                    ? 'border-[#0ed8ff]/70 bg-[linear-gradient(180deg,rgba(9,18,32,0.95),rgba(8,10,22,0.98))] shadow-[0_0_0_1px_rgba(14,216,255,0.12),0_0_24px_rgba(14,216,255,0.16)]'
                    : 'border-[#ff2f76]/70 bg-[linear-gradient(180deg,rgba(31,11,24,0.95),rgba(10,8,18,0.98))] shadow-[0_0_0_1px_rgba(255,47,118,0.12),0_0_24px_rgba(255,47,118,0.18)]'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className={`font-pricedown text-3xl text-stroke-black ${isCyan ? 'text-[#12e9ff]' : 'text-[#ff2f76]'}`}>{card.day}</p>
                      <p className="text-sm uppercase text-stroke-black tracking-[0.22em] text-white">{card.date}</p>
                    </div>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-[0.9rem] border ${isCyan
                        ? 'border-[#12e9ff]/30 bg-[rgba(16,86,92,0.28)] text-[#12e9ff]'
                        : 'border-[#ff2f76]/30 bg-[rgba(111,19,58,0.28)] text-[#ff2f76]'
                        }`}
                    >
                      <Icon size={22} />
                    </div>
                  </div>

                  <h3 className="mt-6 font-pricedown text-2xl text-white sm:text-[2rem] text-stroke-black-2">{card.title}</h3>

                  <div className="mt-6 inline-flex items-center gap-2 rounded-[0.65rem] border border-black/50 bg-black/60 px-4 py-3 text-sm font-semibold tracking-[0.18em] text-white">
                    <span className={isCyan ? 'text-[#12e9ff]' : 'text-[#ff2f76]'}>◔</span>
                    <span>{card.time}</span>
                  </div>

                  <p className={`mt-4 text-right font-mono text-[0.68rem] uppercase tracking-[0.32em] ${isCyan ? 'text-[#12e9ff]/35' : 'text-[#ff2f76]/35'}`}>
                    {card.code}
                  </p>
                </article>
              );
            })}
          </div>
        </motion.section>

        {/* PROGRAM MODULES */}
        <motion.section id="details" className="mt-5 space-y-10" {...sectionMotion}>
          <div className="space-y-4 text-center flex flex-col items-center gap-2">
            <h2 className="font-pricedown text-5xl text-white sm:text-8xl text-stroke-black-2">PROGRAM MODULES</h2>
            <p className="mx-auto max-w-2xl text-md leading-7 text-white/60 sm:text-red-500 font-forresten">
              A structured two-day learning program. <br />Progress through each session at your own pace.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="hidden h-full w-12 items-stretch justify-center lg:flex">
              <div className="relative flex h-full flex-col items-center">
                <div className="absolute left-1/2 top-0 h-[82%] w-0.5 -translate-x-1/2 bg-[linear-gradient(180deg,rgba(24,233,255,0.95),rgba(24,233,255,0.1))] blur-[1px]" />
                <div className="relative flex h-full flex-col justify-between py-2">
                  {programModules.map((step, index) => (
                    <div
                      key={step.number}
                      className={`h-4 w-4 rounded-full border-2 ${index === 0 ? 'border-[#18e9ff] bg-[#18e9ff] shadow-[0_0_0_8px_rgba(24,233,255,0.18)]' : 'border-white/30 bg-[#070814]'
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {programModules.map((step) => {
                const muted = step.muted;
                const Icon = step.icon;
                const stars = Array.from({ length: 5 }, (_, index) => index < step.stars);

                return (
                  <article
                    key={step.number}
                    className={`grid gap-4 rounded-[1.4rem] border px-5 py-5 sm:px-6 sm:py-6 md:grid-cols-[5.5rem_1fr_auto] md:items-center ${step.accent === 'cyan'
                      ? 'border-[#18e9ff]/45 bg-[rgba(7,12,24,0.88)] shadow-[0_0_0_1px_rgba(24,233,255,0.12),0_0_34px_rgba(24,233,255,0.14)]'
                      : step.accent === 'violet'
                        ? 'border-[#6b11ff]/50 bg-[rgba(20,7,38,0.9)] shadow-[0_0_0_1px_rgba(123,33,255,0.15),0_0_34px_rgba(123,33,255,0.2)]'
                        : muted
                          ? 'border-white/5 bg-[rgba(9,10,20,0.7)] opacity-80'
                          : 'border-[#ff2e7d]/40 bg-[rgba(25,8,18,0.9)]'
                      }`}
                  >
                    <div className={`flex items-center justify-center rounded-[1rem] border bg-black/20 py-5 text-3xl font-semibold ${step.accent === 'cyan' ? 'border-[#18e9ff]/30 text-[#18e9ff]' : step.accent === 'violet' ? 'border-[#6b11ff]/30 text-[#9f4dff]' : 'border-white/5 text-white/30'}`}>
                      {step.number}
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-pricedown leading-[1.1em] text-xl text-white sm:text-2xl !tracking-[0.1em]">{step.title}</h3>
                      <p className="text-sm font-forresten text-white/55 sm:text-base">{step.subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
                      <div className="flex items-center gap-3">
                        {step.tag ? (
                          <span
                            className={`rounded-md border px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${step.accent === 'violet'
                              ? 'border-[#8f3bff]/50 bg-[#7b21ff] text-white'
                              : 'border-[#18e9ff]/30 bg-[#0b2a30] text-[#18e9ff]'
                              } ${step.tag === 'SCHEDULED' ? 'text-red-500' : ''}`}
                          >
                            {step.tag}
                          </span>
                        ) : null}

                        <div className="flex items-center gap-1.5">
                          {stars.map((isActive, index) => (
                            <FiStar
                              key={`${step.number}-star-${index}`}
                              size={18}
                              className={`sm:h-5 sm:w-5 ${isActive
                                ? 'text-white/90 fill-yellow-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]'
                                : 'text-white/20'
                                }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border ${step.accent === 'cyan'
                          ? 'border-[#18e9ff]/35 bg-[#07242a] text-[#18e9ff]'
                          : 'border-[#ff2e7d]/35 bg-[#2a0b1a] text-[#ff2e7d]'
                          }`}
                      >
                        <Icon size={20} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* PROGRAM DETAILS (Duration, Mode, Eligibility) */}
        <motion.section id="program-info" className="space-y-20" {...sectionMotion}>
          <div className="w-full rounded-[1.5rem] border border-[#ff2d73]/60 bg-[radial-gradient(circle_at_top,rgba(255,73,138,0.28),rgba(16,5,17,0.96))] p-6 shadow-[0_0_0_1px_rgba(255,45,115,0.2),0_0_48px_rgba(255,45,115,0.2)] sm:p-8 flex flex-col items-center justify-center">
            <p className="font-pricedown text-3xl text-white text-stroke-black-2 flex items-center gap-2">
              <FiCheckCircle className="text-[#ff2e7d]" /> PROGRAM DETAILS
            </p>
            <div className="mt-6 w-full">
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1rem] border border-white/10 bg-[rgba(255,81,140,0.2)] p-6 text-center">
                  <strong className="block font-pricedown text-4xl text-[#ff8ab5] text-stroke-black-2">2 DAYS</strong>
                  <span className="mt-2 block text-md font-semibold uppercase tracking-[0.2em] font-forresten text-white/85">
                    Duration
                  </span>
                </div>

                <div className="rounded-[1rem] border border-white/8 bg-[rgba(14,10,25,0.8)] p-6 text-center">
                  <strong className="block font-pricedown text-4xl text-[#18e9ff] text-stroke-black-2">ON-CAMPUS</strong>
                  <span className="mt-2 block text-md font-semibold uppercase tracking-[0.2em] font-forresten text-white/85">
                    Mode
                  </span>
                </div>

                <div className="rounded-[1rem] border border-white/8 bg-[rgba(14,10,25,0.8)] p-6 text-center">
                  <strong className="block font-pricedown text-3xl text-[#ff8ab5] text-stroke-black-2">AKGEC</strong>
                  <span className="mt-2 block text-md font-semibold uppercase tracking-[0.2em] font-forresten text-white/85">
                    Eligibility
                  </span>
                  <span className="mt-1 block text-xs text-white/50 font-forresten">Students of AKGEC only</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* PROGRAM BENEFITS */}
        <motion.section id="benefits" className="space-y-20" {...sectionMotion}>
          <div className="space-y-4 text-center">
            <h2 className="font-pricedown text-3xl text-white sm:text-8xl text-stroke-black-2">PROGRAM BENEFITS</h2>
          </div>

          <div className="relative isolate">
            <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-[26rem] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(255,191,29,0.18),rgba(255,191,29,0.06)_35%,transparent_72%)] blur-3xl" />

            <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-center">
              {benefits.map((benefit, index) => (
                <BenefitRevealCard
                  key={benefit.title}
                  benefit={benefit}
                  index={index}
                  isScrolling={isScrolling}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ / QUERIES */}
        <motion.section
          id="queries"
          className="space-y-20"
        >
          <div className="space-y-4 text-center">
            <h2 className="font-pricedown text-5xl text-white sm:text-8xl">FREQUENTLY ASKED</h2>
          </div>

          <motion.div
            className="mx-auto max-w-4xl space-y-4"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              const slideFromLeft = index % 2 === 0;

              return (
                <motion.article
                  key={item.question}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, x: slideFromLeft ? -100 : 100, scale: 0.95 }
                  }
                  whileInView={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.18 : 0.6,
                    delay: index * 0.08,
                    ease: 'easeOut',
                  }}
                  className={`overflow-hidden rounded-[1rem] border transition-all duration-300 ${isOpen
                    ? 'border-[#18e9ff]/45 bg-[rgba(8,12,26,0.95)] shadow-[0_0_0_1px_rgba(24,233,255,0.12),0_0_30px_rgba(24,233,255,0.08)]'
                    : 'border-white/5 bg-[rgba(10,11,20,0.8)]'
                    }`}
                >
                  <motion.button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    animate={isOpen ? { x: 14 } : { x: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    onClick={() => setOpenFaq((current) => (current === index ? -1 : index))}
                  >
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-red-600 text-forresten sm:text-base">
                      {item.question}
                    </span>
                    {isOpen ? <FiMinus size={22} className="text-[#18e9ff]" /> : <FiPlus size={22} className="text-white/55" />}
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="px-5 pb-5"
                      >
                        <p className="max-w-3xl text-sm leading-7 text-white/65 sm:text-base">{item.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Contact / Policy Section */}
          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
            {/* Contact */}
            <div id="contact" className="rounded-[1.25rem] border border-white/10 bg-[rgba(8,10,22,0.88)] p-6 space-y-3">
              <p className="font-pricedown text-lg text-[#18e9ff] tracking-widest">CONTACT US</p>
              <p className="text-sm text-white/60 leading-6 font-forresten">
                For any queries, please reach out:
              </p>
              <a href="mailto:gdg@akgec.ac.in" className="block text-sm text-[#18e9ff] hover:underline break-all">
                gdg@akgec.ac.in
              </a>
              <p className="text-xs text-white/40 font-forresten">
                Google Developer Groups on Campus, AKGEC
              </p>
            </div>

            {/* Privacy */}
            <div id="privacy" className="rounded-[1.25rem] border border-white/10 bg-[rgba(8,10,22,0.88)] p-6 space-y-3">
              <p className="font-pricedown text-lg text-[#ff8ab5] tracking-widest">PRIVACY POLICY</p>
              <p className="text-sm text-white/60 leading-6 font-forresten">
                We collect basic information (name, email, contact) solely for program registration. This data is not sold or shared with third parties.
              </p>
            </div>

            {/* Refund */}
            <div id="refund" className="rounded-[1.25rem] border border-white/10 bg-[rgba(8,10,22,0.88)] p-6 space-y-3">
              <p className="font-pricedown text-lg text-[#ffc629] tracking-widest">REFUND POLICY</p>
              <p className="text-sm text-white/60 leading-6 font-forresten">
                All payments are final and non-refundable. Refunds will only be issued if the program is cancelled by the organizers.
              </p>
            </div>
          </div>

          {/* Terms */}
          <div id="terms" className="mx-auto max-w-4xl rounded-[1.25rem] border border-white/8 bg-[rgba(8,10,22,0.7)] p-6">
            <p className="font-pricedown text-lg text-white/70 mb-3">TERMS &amp; CONDITIONS</p>
            <ul className="space-y-2 text-sm text-white/50 font-forresten leading-6 list-disc list-inside">
              <li>By registering, you agree to provide accurate personal information.</li>
              <li>This platform is intended for student registrations for programs conducted within AKGEC.</li>
              <li>Participation is subject to eligibility criteria defined by the organizers.</li>
              <li>The organizers reserve the right to disqualify any participant found violating program guidelines.</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default EventDetails;
