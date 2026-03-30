import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiAward,
  FiBookOpen,
  FiGift,
  FiLock,
  FiMinus,
  FiPlus,
  FiRadio,
  FiShield,
  FiTarget,
  FiUnlock,
  FiStar,
} from 'react-icons/fi';
import { TfiGame } from "react-icons/tfi";
import { GiCrossMark } from "react-icons/gi";
import backgroundImage from '../assets/images/landingpage-background.jpg';

const missionSteps = [
  {
    number: '01',
    title: 'ACCESS CODE BREAK',
    subtitle: 'Aptitude & Pattern Puzzle',
    tag: 'UNLOCKED',
    icon: FiUnlock,
    accent: 'cyan',
    muted: false,
    stars: 1,
  },
  {
    number: '02',
    title: 'LOGIC FIREWALL',
    subtitle: 'Code Output & Logic Analysis',
    tag: 'LOCKED',
    icon: FiLock,
    accent: 'pink',
    muted: true,
    stars: 2,
  },
  {
    number: '03',
    title: 'CODE DECRYPTION',
    subtitle: 'Debugging Challenge',
    tag: 'LOCKED',
    icon: FiLock,
    accent: 'pink',
    muted: true,
    stars: 3,
  },
  {
    number: '04',
    title: 'SYSTEM PATCH',
    subtitle: 'Binary + Encryption + Programming',
    tag: 'LOCKED',
    icon: FiLock,
    accent: 'pink',
    muted: true,
    stars: 4,
  },
  {
    number: '05',
    title: 'FINAL SECURITY TEST',
    subtitle: 'Multiple Choice Questions',
    tag: 'TOP 3 TEAMS ONLY',
    icon: FiShield,
    accent: 'violet',
    muted: false,
    stars: 5,
  },
];

const rewards = [
  {
    title: 'RUNNER UPS',
    description: 'Exclusive Stickers',
    icon: FiAward,
    accent: 'silver',
  },
  {
    title: 'TOP 3 WINNERS',
    description: 'Direct PI Entry',
    detail: '+ Cup / Bottle',
    icon: FiTarget,
    accent: 'gold',
    featured: true,
  },
  {
    title: 'PARTICIPANTS',
    description: 'Key Chains',
    icon: FiGift,
    accent: 'amber',
  },
];

const rewardCardStyles = {
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

const faqItems = [
  {
    question: 'DO I NEED ADVANCED HACKING SKILLS?',
    answer:
      'Basic to intermediate coding logic is enough. The event focuses on problem-solving, aptitude, and clean technical thinking rather than raw security hacking.',
  },
  {
    question: 'CAN I FORM MY OWN 6-MEMBER TEAM?',
    answer:
      'Yes. Teams can be self-formed as long as they respect the participation rules and registration requirements shared by the organizers.',
  },
  {
    question: 'WHAT HAPPENS IF WE FAIL TO DECRYPT A LEVEL?',
    answer:
      'You can still progress with partial scoring on some rounds. The scoring matrix rewards attempts, clue usage, and time management.',
  },
  {
    question: 'ARE THE FINAL SECURITY TEST QUESTIONS THEORETICAL?',
    answer:
      'The final round mixes concept checks, pattern recognition, and practical reasoning. The intent is to test team coordination under pressure.',
  },
];

const dayCards = [
  {
    day: 'DAY 01',
    date: '6TH APRIL',
    title: 'technical learning session',
    time: '2:00 PM - 5:00 PM',
    icon: FiBookOpen,
    tone: 'cyan',
    code: '[ SYS.OK ]',
  },
  {
    day: 'DAY 02',
    date: '7TH APRIL',
    title: 'gamified tech challenge',
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

  return (
    <section className="relative bg-[#070814] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-20">
        <motion.section id="missions" className="space-y-8" {...sectionMotion}>
          <div className="rounded-[1.6rem] border border-[#6b11ff]/60 bg-[linear-gradient(180deg,rgba(16,8,30,0.98),rgba(8,8,20,0.98))] p-6 shadow-[0_0_0_1px_rgba(123,33,255,0.16),0_0_48px_rgba(123,33,255,0.18)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.72fr] lg:items-center">
              <div className="space-y-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.34em] text-[#9f4dff]">
                  &gt;&gt; decrypting file: lore.txt
                </p>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full text-[#8f26ff] shadow-[0_0_0_1px_rgba(143,38,255,0.32),0_0_24px_rgba(143,38,255,0.22)]">
                    <FiRadio size={36} />
                  </div>
                  <h2 className="font-pricedown text-3xl sm:text-4xl text-black text-stroke-white">
                    THE HEIST PROTOCOL
                  </h2>
                </div>

                <p className="max-w-3xl text-sm leading-7 text-white sm:text-base text-stroke-black">
                  The city&apos;s central mainframe has been locked down by a rogue security AI. We need the sharpest coders,
                  hackers, and logicians to bypass the firewalls and penetrate the inner core. The tech heist of the decade is
                  about to begin. Assemble your crew, decrypt the algorithms, and secure the loot before the system inevitably
                  reboots. <span className="font-semibold text-[#ff356d] ">Are you in?</span>
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

        <motion.section id="directory" className="mt-10 space-y-10" {...sectionMotion}>
          <div className="space-y-4 text-center flex flex-col items-center gap-2  ">
            <h2 className="font-pricedown text-3xl text-white sm:text-6xl text-stroke-black-2">MISSION DIRECTORY</h2>
            <p className="mx-auto  max-w-2xl text-md leading-7 text-white/60 sm:text-red-500 font-chalet">
              Progress through the security mainframe. <br />One wrong move and you&rsquo;re locked out.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="hidden h-full w-12 items-stretch justify-center lg:flex">
              <div className="relative flex h-full flex-col items-center">
                <div className="absolute left-1/2 top-0 h-[82%] w-0.5 -translate-x-1/2 bg-[linear-gradient(180deg,rgba(24,233,255,0.95),rgba(24,233,255,0.1))] blur-[1px]" />
                <div className="relative flex h-full flex-col justify-between py-2">
                  {missionSteps.map((step, index) => (
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
              {missionSteps.map((step) => {
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
                      <h3 className="font-pricedown text-xl text-white sm:text-2xl">{step.title}</h3>
                      <p className="text-sm text-white/55 sm:text-base">{step.subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 md:justify-end">
                      <div className="flex items-center gap-3">
                        {step.tag ? (
                          <span
                            className={`rounded-md border px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.2em] ${step.accent === 'violet'
                              ? 'border-[#8f3bff]/50 bg-[#7b21ff] text-white'
                              : 'border-[#18e9ff]/30 bg-[#0b2a30] text-[#18e9ff]'
                              } ${step.tag === 'LOCKED' ? 'text-red-500' : ''}`}
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
                                ? 'text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.18)]'
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

        <motion.section id="scoring" className="space-y-20" {...sectionMotion}>
          <div className="w-full rounded-[1.5rem] border border-[#ff2d73]/60 bg-[radial-gradient(circle_at_top,rgba(255,73,138,0.28),rgba(16,5,17,0.96))] p-6 shadow-[0_0_0_1px_rgba(255,45,115,0.2),0_0_48px_rgba(255,45,115,0.2)] sm:p-8 flex flex-col items-center justify-center">
            <p className="font-pricedown text-3xl text-white text-stroke-black-2 flex "><GiCrossMark className="text-[#ff2e7d] text-stroke-black-2" />FINAL ROUND BATTLE</p>
            <div className="mt-6 w-full">
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1rem] border border-white/10 bg-[rgba(255,81,140,0.2)] p-6 text-center">
                  <strong className="block font-pricedown text-4xl text-[#ff8ab5] text-stroke-black-2">TOP 3</strong>
                  <span className="mt-2 block text-sm font-semibold uppercase tracking-[0.2em] text-white/85">
                    Teams advance
                  </span>
                </div>

                <div className="rounded-[1rem] border border-white/8 bg-[rgba(14,10,25,0.8)] p-6 text-center">
                  <span className="block font-chalet text-[24px] leading-[25.6px] text-center text-white/80 text-stroke-black">
                    18 Participants
                  </span>
                  <span className="mt-4 inline-flex flex-col w-full rounded-md border border-[#18e9ff]/35 bg-[rgba(10,34,40,0.88)] px-4 py-2 font-semibold  text-[#18e9ff]">
                    <div className="font-pricedown text-stroke-black-2 text-[24px] leading-[25.6px]">Live Leaderboard</div>
                    <small className="mt-2 block text-xs text-white/50">(Kahoot Style)</small>
                  </span>
                </div>
              </div>

            </div>


          </div>
        </motion.section>

        <motion.section id="loot" className="space-y-20" {...sectionMotion}>
          <div className="space-y-4 text-center">
            <h2 className="font-pricedown text-3xl text-white sm:text-8xl text-stroke-black-2">THE LOOT</h2>
          </div>

          <div className="relative isolate">
            <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-[26rem] max-w-5xl rounded-full bg-[radial-gradient(circle_at_center,rgba(255,191,29,0.18),rgba(255,191,29,0.06)_35%,transparent_72%)] blur-3xl" />

            <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
              {rewards.map((reward) => (
                <article
                  key={reward.title}
                  className={`group relative overflow-hidden rounded-[1.65rem] border p-6 text-center ${rewardCardStyles[reward.accent].border} ${rewardCardStyles[reward.accent].panel} ${rewardCardStyles[reward.accent].glow} ${reward.featured ? 'min-h-[28rem] lg:min-h-[31rem]' : 'min-h-[22rem] lg:mt-8 lg:min-h-[25rem]'
                    } transition-transform duration-300 hover:-translate-y-1`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)] opacity-80" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)]" />

                  <div className="relative flex h-full flex-col items-center justify-start px-3 py-4 sm:px-4 sm:py-6">
                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-full border text-[2rem] sm:h-24 sm:w-24 sm:text-[2.25rem] ${reward.featured ? 'scale-110 sm:scale-125' : ''
                        } ${rewardCardStyles[reward.accent].icon}`}
                    >
                      <reward.icon />
                    </div>

                    <h3
                      className={`mt-7 font-pricedown text-[1.95rem] uppercase leading-none sm:text-[2.25rem] ${reward.featured ? 'sm:text-[2.45rem]' : ''
                        } ${rewardCardStyles[reward.accent].title} ${rewardCardStyles[reward.accent].titleGlow}`}
                    >
                      {reward.title}
                    </h3>

                    <p className={`mt-4 text-base font-medium sm:text-lg ${reward.featured ? 'sm:text-xl' : ''} ${rewardCardStyles[reward.accent].body}`}>{reward.description}</p>

                    {reward.detail ? (
                      <div
                        className={`mt-5 inline-flex items-center rounded-full border border-[#ffcc4d]/35 bg-[rgba(255,191,29,0.08)] px-4 py-2 text-sm font-semibold ${rewardCardStyles[reward.accent].detail}`}
                      >
                        {reward.detail}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="queries" className="space-y-20" {...sectionMotion}>
          <div className="space-y-4 text-center">
            <h2 className="font-pricedown text-3xl text-white sm:text-4xl">INTEL &amp; QUERIES</h2>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-white/50">[ FAQ.DAT ] - Frequently Asked Questions</p>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;

              return (
                <article
                  key={item.question}
                  className={`overflow-hidden rounded-[1rem] border transition-all duration-300 ${isOpen
                    ? 'border-[#18e9ff]/45 bg-[rgba(8,12,26,0.95)] shadow-[0_0_0_1px_rgba(24,233,255,0.12),0_0_30px_rgba(24,233,255,0.08)]'
                    : 'border-white/5 bg-[rgba(10,11,20,0.8)]'
                    }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    onClick={() => setOpenFaq((current) => (current === index ? -1 : index))}
                  >
                    <span className="text-sm font-semibold uppercase tracking-[0.14em] text-white sm:text-base">
                      {item.question}
                    </span>
                    {isOpen ? <FiMinus size={22} className="text-[#18e9ff]" /> : <FiPlus size={22} className="text-white/55" />}
                  </button>

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
                </article>
              );
            })}
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default EventDetails;
