import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

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
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10">
      <div className="rounded-[1.25rem] border border-[#18e9ff]/40 bg-[rgba(5,16,26,0.96)] px-4 py-6 shadow-[0_0_0_1px_rgba(24,233,255,0.12),0_24px_80px_-36px_rgba(24,233,255,0.1)] sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[#18e9ff]">
            <p className="font-manrope text-[0.76rem] font-semibold uppercase tracking-[0.42em]">Google Developer Groups</p>
            <p className="font-manrope text-[0.76rem] font-semibold uppercase tracking-[0.42em]">on campus AKGEC</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[#18e9ff] sm:flex-1">
            <FiCheckCircle className="h-10 w-10 drop-shadow-[0_0_10px_rgba(24,233,255,0.6)]" />
            <FiCheckCircle className="h-10 w-10 drop-shadow-[0_0_10px_rgba(24,233,255,0.6)]" />
            <FiCheckCircle className="h-10 w-10 drop-shadow-[0_0_10px_rgba(24,233,255,0.6)]" />
            <FiCheckCircle className="h-10 w-10 drop-shadow-[0_0_10px_rgba(24,233,255,0.6)]" />
          </div>
          <div className="hidden sm:block sm:w-24" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="mt-14 rounded-[2rem] border border-[#5bff4f]/65 bg-[radial-gradient(circle_at_center,rgba(54,134,45,0.8),rgba(18,60,11,0.96))] p-4 shadow-[0_0_0_1px_rgba(94,255,76,0.18),0_0_60px_rgba(65,255,45,0.22)] sm:mt-24 sm:p-8"
      >
        <div className="rounded-[1.5rem] border border-[#71ff6a]/90 bg-[radial-gradient(circle_at_top,rgba(72,103,68,0.96),rgba(18,108,10,0.96))] px-4 py-8 text-center shadow-[inset_0_0_60px_rgba(255,255,255,0.06)] sm:px-10 sm:py-14">
          <FiCheckCircle className="mx-auto h-16 w-16 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] sm:h-20 sm:w-20" aria-hidden="true" />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-[#d6ffcf]">Registration Confirmed</p>
          <h1 className="mt-5 font-pricedown text-4xl text-[#14e100] drop-shadow-[0_2px_0_rgba(0,0,0,0.35)] sm:text-5xl">
            Registration Successful
          </h1>
          <p className="mt-5 text-base font-semibold uppercase tracking-[0.26em] text-[#b9ffb3] sm:text-lg">
            Your program registration has been successfully completed.
          </p>

          <p className="mt-4 mx-auto max-w-xl text-sm leading-7 text-[#d6ffcf]/75 font-forresten">
            A confirmation has been recorded for your participation in this student program at Ajay Kumar Garg Engineering College.
            Please keep a record of your payment reference for the program.
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 rounded-[1.25rem] border border-white/10 bg-black/15 p-4 text-left sm:mt-10 sm:grid-cols-2 sm:p-6">
            {details.map((detail) => (
              <div key={detail.label} className="min-w-0 rounded-[1rem] border border-white/8 bg-black/10 p-4">
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{detail.label}</span>
                <strong className="mt-2 block break-words text-base text-white sm:text-lg">{detail.value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button className="w-full sm:flex-1" onClick={() => navigate('/')}>
              Back to Home
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:flex-1"
              onClick={() => {
                window.location.href = 'mailto:gdg@akgec.ac.in';
              }}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RegistrationSuccess;
