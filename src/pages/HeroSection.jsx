/**
 * Landing page hero
 */

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiShield, FiZap } from 'react-icons/fi';
import { FaRocket } from "react-icons/fa";
import { Button } from '../components';
import backgroundImage from '../assets/images/landingpage-background.jpg';
import heroVideo from '../assets/Background.mp4';

const buildTargetDate = (year) => new Date(`${year}-04-06T09:00:00+05:30`);

const getCountdownParts = () => {
  const now = new Date();
  const currentYearTarget = buildTargetDate(now.getFullYear());
  const target = now < currentYearTarget ? currentYearTarget : buildTargetDate(now.getFullYear() + 1);
  const remaining = Math.max(target.getTime() - now.getTime(), 0);

  return {
    days: Math.floor(remaining / (1000 * 60 * 60 * 24)),
    hours: Math.floor((remaining / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((remaining / (1000 * 60)) % 60),
  };
};

const metaItems = [
  { icon: FiCalendar, label: '6TH - 7TH APRIL' },
  { icon: FiMapPin, label: 'AKGEC CAMPUS' },
  { icon: FiShield, label: 'SECURE BUILD ZONE' },
];

export const HeroSection = ({ onCtaClick, onScrollToNext, onVideoReady }) => {
  const [countdown, setCountdown] = useState(getCountdownParts);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdownParts());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return undefined;
    }

    const handleLoadedData = () => {
      setIsVideoReady(true);
      onVideoReady?.();
    };

    const handleCanPlay = async () => {
      setIsVideoReady(true);
      onVideoReady?.();
      try {
        await videoEl.play();
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    videoEl.addEventListener('loadeddata', handleLoadedData);
    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('playing', handlePlaying);
    videoEl.addEventListener('error', handleError);

    return () => {
      videoEl.removeEventListener('loadeddata', handleLoadedData);
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('playing', handlePlaying);
      videoEl.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <section
      id="lore"
      className="relative z-10 min-h-[100svh] overflow-hidden px-4 pb-6 pt-4"
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <img
          src={backgroundImage}
          alt=""
          className={`hero-intro-image ${isLoading ? 'hero-intro-image--visible' : 'hero-intro-image--hidden'}`}
        />
        <video
          ref={videoRef}
          className={`hero-background-video ${isVideoReady ? 'hero-background-video--visible' : 'hero-background-video--hidden'}`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={backgroundImage}
          aria-hidden="true"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,11,0.25)_0%,rgba(4,4,11,0.12)_22%,rgba(4,4,11,0.68)_100%),radial-gradient(circle_at_50%_45%,rgba(255,74,149,0.28),transparent_20%),radial-gradient(circle_at_50%_20%,rgba(18,233,255,0.08),transparent_18%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-[0.2rem] border border-white/8 shadow-[inset_0_0_0_1px_rgba(255,79,159,0.12),inset_0_0_80px_rgba(18,233,255,0.04)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:90px_90px] opacity-20 [mask-image:linear-gradient(180deg,transparent,#000_18%,#000_82%,transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-2rem)] w-full max-w-[940px] items-start justify-items-center pt-[4.5rem]">
        <motion.div
          className="grid w-full justify-items-center text-center"
          initial={{ opacity: 0, y: 35}}
          animate={{ opacity: 1, y: 22 }}
          transition={{ duration: 0.8 }}
        >

          <h1 className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2 text-[clamp(4rem,8vw,8.5rem)] leading-[0.86] uppercase text-white [text-shadow:4px_4px_0_rgba(24,15,48,0.95),0_0_24px_rgba(255,255,255,0.08)]">
            <span className="font-pricedown">CODE THEFT</span>
            <span className="font-pricedown text-[#15e8f2] [text-shadow:4px_4px_0_rgba(9,28,33,0.95),0_0_22px_rgba(21,232,242,0.3)]">
              AUTO
            </span>
          </h1>

          <div className="mt-5 inline-flex flex-col items-center gap-0.5 rounded-[0.9rem] border border-white/16 bg-[rgba(18,16,30,0.4)] px-6 py-3 shadow-[inset_0_0_24px_rgba(255,255,255,0.03),0_0_28px_rgba(0,0,0,0.2)]">
            <span className="font-forresten text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.38em] text-[#1deeff]">
              HACK THE SYSTEM
            </span>
            <span className="font-forresten text-[clamp(1rem,2vw,1.5rem)] uppercase tracking-[0.38em] text-[#1deeff]">
              OWN THE GAME
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-stretch justify-center gap-4">
            <Button
              variant="neon"
              size="xl"
              onClick={onCtaClick}
              className="min-w-[min(100%,18.5rem)] justify-center rounded-[1rem] border border-white/18 bg-[linear-gradient(180deg,rgba(25,33,97,0.98),rgba(18,25,86,0.98))] tracking-[0.08em]"
            >
              <FaRocket size={18} />
              <span>REGISTER NOW</span>
            </Button>

            <div className="flex min-w-[min(100%,14rem)] flex-col justify-center gap-1 rounded-[1rem] border border-white/8 bg-white/8 px-5 py-4 text-left backdrop-blur-[14px]">
              <span className="text-[0.7rem] uppercase tracking-[0.24em] text-white/58">EVENT DATES</span>
              <strong className="text-[clamp(1.25rem,2vw,1.55rem)] font-semibold tracking-[0.03em] text-[#f8f8fb]">
                6TH - 7TH APRIL
              </strong>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {metaItems.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[rgba(7,9,18,0.45)] px-4 py-3 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-white/78"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[1rem] border border-white/8 bg-[rgba(6,6,12,0.9)] px-7 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_80px_-48px_rgba(0,0,0,0.9)]">
            <span className="block text-[0.78rem] font-bold uppercase tracking-[0.26em] text-[#1deeff]">
              COUNTDOWN
            </span>
            <div className="mt-3 flex justify-center gap-4">
              <span className="text-[clamp(2rem,4vw,3rem)] font-medium tracking-[0.02em] text-white">
                {String(countdown.days).padStart(2, '0')}
                <small className="ml-1 text-[0.82em] font-bold text-[#ff4f9f]">D</small>
              </span>
              <span className="text-[clamp(2rem,4vw,3rem)] font-medium tracking-[0.02em] text-white">
                {String(countdown.hours).padStart(2, '0')}
                <small className="ml-1 text-[0.82em] font-bold text-[#ff4f9f]">H</small>
              </span>
              <span className="text-[clamp(2rem,4vw,3rem)] font-medium tracking-[0.02em] text-white">
                {String(countdown.minutes).padStart(2, '0')}
                <small className="ml-1 text-[0.82em] font-bold text-[#ff4f9f]">M</small>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
