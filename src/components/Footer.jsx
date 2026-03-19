/**
 * Main footer with links and information
 */

import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { CodeChip } from './CodeChip';

export const Footer = () => {
  const socialLinks = [
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaGithub, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="mt-24 bg-surface-container-low">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="primary-gradient flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold text-on-primary">
                {'</>'}
              </div>
              <div>
                <h3 className="text-lg font-extrabold">GDG Meridian</h3>
                <p className="text-xs uppercase tracking-[0.22em] text-on-surface-variant">Event portal</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-on-surface-variant">
              A guided registration experience for developers joining the next GDG summit.
            </p>
            <div className="mt-5">
              <CodeChip>build:curated-ui</CodeChip>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-on-surface">Navigate</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-on-surface-variant transition-colors hover:text-primary">Home</a></li>
              <li><a href="/#event-details" className="text-on-surface-variant transition-colors hover:text-primary">Agenda</a></li>
              <li><a href="/#register-section" className="text-on-surface-variant transition-colors hover:text-primary">Register</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-on-surface">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-on-surface-variant transition-colors hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-on-surface-variant transition-colors hover:text-primary">Terms</a></li>
              <li><a href="#" className="text-on-surface-variant transition-colors hover:text-primary">Code of Conduct</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-on-surface">Community</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-on-primary-fixed-variant transition-colors hover:bg-primary hover:text-on-primary"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 text-sm text-on-surface-variant md:flex-row md:items-center md:justify-between">
          <p>(c) 2025 Google Developer Groups. All rights reserved.</p>
          <p>Built for a calmer registration flow.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
