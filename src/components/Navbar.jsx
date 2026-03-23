/**
 * Main navigation bar
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './Button';

export const Navbar = ({ onRegisterClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-3 pt-3' : 'px-3 pt-4'}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className={`glass-panel flex items-center justify-between gap-3 rounded-[1.25rem] px-3 py-3 sm:px-6 ${
          isScrolled ? 'shadow-[0_20px_50px_-36px_rgba(26,28,30,0.22)]' : ''
        }`}>
          <motion.div
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="primary-gradient flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold text-on-primary shadow-[0_18px_40px_-24px_rgba(0,88,189,0.65)]"
              whileHover={{ rotate: 4 }}
            >
              {'</>'}
            </motion.div>
            <div className="flex flex-col">
              <span className="font-manrope text-sm font-extrabold leading-tight text-on-surface sm:text-lg">
                GDG EVENT
              </span>
              <span className="hidden text-xs font-medium uppercase tracking-[0.22em] text-on-surface-variant sm:block">
                Developer registration
              </span>
            </div>
          </motion.div>

          <div className="hidden items-center gap-8 md:flex">
            <motion.a
              href={location.pathname === '/' ? '#register-section' : '/#register-section'}
              className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              whileHover={{ y: -2 }}
            >
              Register
            </motion.a>
            <motion.a
              href={location.pathname === '/' ? '#event-details' : '/#event-details'}
              className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              whileHover={{ y: -2 }}
            >
              Event
            </motion.a>
          </div>

          <Button onClick={onRegisterClick} size="sm" className="px-3 sm:px-5">
            <span className="sm:hidden">Register</span>
            <span className="hidden sm:inline">Start registration</span>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
