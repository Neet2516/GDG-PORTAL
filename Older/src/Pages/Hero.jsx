import React from 'react';
import { motion } from 'framer-motion';
import ThreeDLogo from '../components/ThreeDLogo';

const Hero = ({ onCtaClick }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-blue-800 uppercase bg-white border border-cyan-400/20 rounded-full">
            CSI EVENT 2025
          </span> */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-poppins font-extrabold  bg-clip-text text-transparent bg-linear-to-t from-[#365de8] via-white to-blue-800  mb-6 leading-tight">
            RENDER 4.0 <br />
            <ThreeDLogo/>
          </h1>
          <p className="text-gray-400 p-3 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Workshop  curated  for Developers  - HTML CSS JS & REACT.js
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-3 text-white/80 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">March 15, 2025</span>
            </div>
            <div className="flex items-center gap-3 text-white/80 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">10:00 AM - 04:00 PM</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCtaClick}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-200  bg-[#365de8] rounded-full hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          >
            Claim Your Spot
            <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.button>
        </motion.div>
      </div>

      {/* Hero visual elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>
    </section>
  );
};

export default Hero;