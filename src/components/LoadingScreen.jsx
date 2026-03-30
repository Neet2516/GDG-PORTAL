import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#02040b]"
        >
          <div className="relative flex flex-col items-center">
            <h1 className="font-pricedown text-[clamp(3.5rem,6vw,5.5rem)] text-white tracking-widest text-stroke-black-2 drop-shadow-[0_0_15px_rgba(24,233,255,0.8)] animate-pulse">
              INITIALIZING_
            </h1>
            <p className="mt-4 font-mono text-sm sm:text-base text-[#1deeff] uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(29,238,255,0.8)]">
              DECRYPTING MAINFRAME
            </p>
            <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 2, ease: 'easeOut', repeat: Infinity }}
                className="h-full bg-[linear-gradient(90deg,transparent,#1deeff)]"
              />
            </div>
          </div>
          
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:90px_90px] opacity-10 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
