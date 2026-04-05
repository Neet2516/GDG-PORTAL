/**
 * Main navigation bar
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import gdgLogo from '../assets/images/gdg-logo.png';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Program', href: '#program' },
  { label: 'Details', href: '#details' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Register', href: '/register', accent: true },
];

export const Navbar = ({ onRegisterClick, onNavigateTo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const resolveHref = (hash) => (location.pathname === '/' ? hash : `/${hash}`);

  const handleBrandClick = () => {
    if (location.pathname === '/') {
      onNavigateTo?.('#about');
      return;
    }

    navigate('/');
  };

  return (
    <motion.nav
      className={`fixed left-0 right-0 top-0 z-50 px-4 pt-4 ${isScrolled ? 'pt-3' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 rounded-full border border-cyan-400/15 bg-[rgba(5,9,23,0.72)] px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_32px_rgba(17,233,255,0.08)] backdrop-blur-[22px]">
        <motion.button
          type="button"
          className="flex items-center gap-3 border-0 bg-transparent p-0 text-left text-white"
          onClick={handleBrandClick}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <img className="h-9 w-9  hidden  md:block  flex-none object-contain" src={gdgLogo} alt="" aria-hidden="true" />
          <span className="grid gap-0.5">
            <span className="text-[0.82rem] font-extrabold uppercase tracking-[0.16em] text-white font-forresten">
              Google Developer Groups
            </span>
            <span className="text-[0.7rem] hidden md:block uppercase tracking-[0.1em] text-white/60">
              on campus Ajay Kumar Garg Engineering College
            </span>
          </span>
        </motion.button>

        <div className="hidden flex-wrap items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={resolveHref(item.href)}
              className={`rounded-full border px-4 py-3 text-[0.78rem] font-extrabold uppercase tracking-[0.16em] transition-colors ${
                item.accent
                  ? 'border-cyan-300/40 bg-cyan-300/10 text-white'
                  : 'border-transparent text-white/78 hover:border-cyan-300/30 hover:bg-cyan-300/8 hover:text-white'
              }`}
              onClick={(event) => {
                if (item.accent) {
                  event.preventDefault();
                  onRegisterClick();
                  return;
                }

                if (location.pathname === '/') {
                  event.preventDefault();
                  onNavigateTo?.(item.href);
                }
              }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/4 text-white lg:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <motion.div
          className="mx-auto mt-3 block w-full max-w-[1200px] rounded-[1.5rem] border border-cyan-400/15 bg-[rgba(5,9,23,0.72)] p-4 backdrop-blur-[22px] lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={resolveHref(item.href)}
              className={`block rounded-xl px-4 py-3 text-[0.82rem] font-extrabold uppercase tracking-[0.16em] ${
                item.accent
                  ? 'bg-cyan-300/10 text-white'
                  : 'text-white/82 hover:bg-cyan-300/8 hover:text-white'
              }`}
              onClick={(event) => {
                setIsMenuOpen(false);
                if (item.accent) {
                  event.preventDefault();
                  onRegisterClick();
                  return;
                }

                if (location.pathname === '/') {
                  event.preventDefault();
                  onNavigateTo?.(item.href);
                }
              }}
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            className="mt-3 block rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-3 text-[0.8rem] font-extrabold uppercase tracking-[0.18em] text-white"
            onClick={() => {
              setIsMenuOpen(false);
              onRegisterClick();
            }}
          >
            Register Now
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
