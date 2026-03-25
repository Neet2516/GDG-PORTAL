import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

import { Button } from '../components';

export const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = '', verificationToken = '', ...userData } = location.state || {};

  useEffect(() => {
    if (!verificationToken) {
      navigate('/');
    }
  }, [verificationToken, navigate]);

  const details = [
    { label: 'Name', value: userData.name || 'Not available' },
    { label: 'Email', value: email || 'Not available' },
    { label: 'Student Number', value: userData.studentNumber || 'Not available' },
    { label: 'Branch', value: userData.branch || 'Not available' },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[1.25rem] border border-[#ff4040] bg-[#451d1d] px-4 py-6 shadow-[0_0_0_2px_rgba(255,64,64,0.45),0_24px_80px_-36px_rgba(255,0,0,0.4)] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[#ff4040]">
            <p className="font-manrope text-[0.76rem] font-semibold uppercase tracking-[0.42em]">Threat level</p>
            <p className="font-manrope text-[0.76rem] font-semibold uppercase tracking-[0.42em]">Registered</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[#ff2e4b] sm:flex-1">
            <FiStar className="h-10 w-10 drop-shadow-[0_0_10px_rgba(255,46,75,0.8)]" />
            <FiStar className="h-10 w-10 drop-shadow-[0_0_10px_rgba(255,46,75,0.8)]" />
            <FiStar className="h-10 w-10 drop-shadow-[0_0_10px_rgba(255,46,75,0.8)]" />
            <FiStar className="h-10 w-10 drop-shadow-[0_0_10px_rgba(255,46,75,0.8)]" />
          </div>
          <div className="hidden sm:block sm:w-24" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="mt-24 rounded-[2rem] border border-[#5bff4f]/65 bg-[radial-gradient(circle_at_center,rgba(65,255,45,0.8),rgba(18,60,11,0.96))] p-5 shadow-[0_0_0_1px_rgba(94,255,76,0.18),0_0_60px_rgba(65,255,45,0.22)] sm:p-8"
      >
        <div className="rounded-[1.5rem] border border-[#71ff6a]/90 bg-[radial-gradient(circle_at_top,rgba(60,197,43,0.96),rgba(18,108,10,0.96))] px-6 py-10 text-center shadow-[inset_0_0_60px_rgba(255,255,255,0.06)] sm:px-10 sm:py-14">
          <FiStar className="mx-auto h-16 w-16 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] sm:h-20 sm:w-20" aria-hidden="true" />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-[#d6ffcf]">Mission Complete</p>
          <h1 className="mt-5 font-pricedown text-4xl text-[#14e100] drop-shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:text-5xl">
            You&apos;re in the game
          </h1>
          <p className="mt-5 text-base font-semibold uppercase tracking-[0.26em] text-[#b9ffb3] sm:text-lg">
            Registration successfull
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 rounded-[1.25rem] border border-white/10 bg-black/15 p-5 text-left sm:grid-cols-2 sm:p-6">
            {details.map((detail) => (
              <div key={detail.label} className="rounded-[1rem] border border-white/8 bg-black/10 p-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{detail.label}</span>
                <strong className="mt-2 block text-base text-white sm:text-lg">{detail.value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button className="w-full sm:flex-1" onClick={() => navigate('/')}>
              Back to home
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:flex-1"
              onClick={() => {
                window.location.href = 'mailto:gdg@example.com';
              }}
            >
              Contact support
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RegistrationSuccess;
