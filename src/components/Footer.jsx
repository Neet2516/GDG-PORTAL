/**
 * Landing page footer
 */

import { motion } from 'framer-motion';
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import gdgLogo from '../assets/images/gdg-logo.png';

const socialLinks = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaGithub, href: '#', label: 'GitHub' },
];

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-black px-4 py-12 text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8">
        <div className="grid justify-items-center gap-2 text-center">
          <img className="mb-1 h-auto w-[5.5rem] object-contain" src={gdgLogo} alt="" aria-hidden="true" />
          <h2 className="text-[clamp(1.45rem,2.2vw,2.05rem)] font-manrope font-bold tracking-[-0.04em]">
            Google Developer Groups
          </h2>
          <p className="text-[clamp(0.95rem,1.5vw,1.1rem)] leading-[1.6] text-white/80">
            on campus Ajay Kumar Garg Engineering College
          </p>

          <div className="mt-2 flex justify-center gap-4 sm:gap-6">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <link.icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-4">
          <a href="/#lore" className="text-[0.82rem] font-medium uppercase tracking-[0.2em] text-white/50">
            Lore
          </a>
          <a href="/#missions" className="text-[0.82rem] font-medium uppercase tracking-[0.2em] text-white/50">
            Missions
          </a>
          <a href="/#scoring" className="text-[0.82rem] font-medium uppercase tracking-[0.2em] text-white/50">
            Briefing
          </a>
          <a href="/#loot" className="text-[0.82rem] font-medium uppercase tracking-[0.2em] text-white/50">
            Loot
          </a>
          <a href="/#queries" className="text-[0.82rem] font-medium uppercase tracking-[0.2em] text-white/50">
            Queries
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[1200px] flex-wrap justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-center text-[0.78rem] uppercase tracking-[0.12em] text-white/28 sm:justify-between">
        <span>© 2026 TECH HEIST PROTOCOL. ALL RIGHTS RESERVED.</span>
        <span>GOOGLE DEVELOPER GROUPS ON CAMPUS AKGEC</span>
      </div>
    </footer>
  );
};

export default Footer;
