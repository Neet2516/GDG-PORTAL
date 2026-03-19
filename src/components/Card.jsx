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
    default: 'bg-surface-container-lowest ambient-shadow',
    elevated: 'bg-surface-container-lowest ambient-shadow',
    outlined: 'bg-surface-container-lowest ambient-shadow',
    glass: 'glass-panel bg-surface/70',
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
