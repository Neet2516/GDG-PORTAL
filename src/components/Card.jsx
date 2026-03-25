/**
 * Card Component
 * Reusable layered container
 */

import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  clickable = false,
  onClick,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default:
      'border border-[#1a8d98]/35 bg-[linear-gradient(180deg,rgba(6,22,24,0.96),rgba(5,13,16,0.98))] shadow-[0_0_0_1px_rgba(24,233,255,0.06),0_24px_70px_-42px_rgba(0,0,0,0.9)]',
    elevated:
      'border border-[#1a8d98]/35 bg-[linear-gradient(180deg,rgba(6,22,24,0.96),rgba(5,13,16,0.98))] shadow-[0_0_0_1px_rgba(24,233,255,0.06),0_24px_70px_-42px_rgba(0,0,0,0.9)]',
    outlined:
      'border border-[#18e9ff]/25 bg-[linear-gradient(180deg,rgba(6,22,24,0.96),rgba(5,13,16,0.98))] shadow-[0_0_0_1px_rgba(24,233,255,0.06),0_24px_70px_-42px_rgba(0,0,0,0.9)]',
    glass: 'border border-[#18e9ff]/18 bg-[rgba(5,16,18,0.72)] backdrop-blur-xl',
  };

  return (
    <motion.div
      className={`rounded-[1.5rem] p-6 transition-all duration-300 md:p-8 ${variantStyles[variant]} ${clickable ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      whileHover={clickable ? { scale: 1.01, translateY: -4 } : { translateY: -2 }}
      whileTap={clickable ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
