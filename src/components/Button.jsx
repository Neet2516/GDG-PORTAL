/**
 * Button Component
 * Reusable button with multiple variants
 */

import { motion } from 'framer-motion';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-manrope font-semibold tracking-wide transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50';

  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3 text-sm md:text-base',
    lg: 'px-6 py-3.5 text-base md:px-8 md:py-4',
    xl: 'px-7 py-4 text-base md:px-10 md:py-5 md:text-lg',
  };

  const variantStyles = {
    primary:
      'border border-[#ff3f86]/70 bg-[linear-gradient(135deg,rgba(255,61,117,0.98),rgba(255,74,148,0.98))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_48px_-28px_rgba(255,61,117,0.7)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.2),0_20px_54px_-24px_rgba(255,61,117,0.78)]',
    secondary:
      'border border-[#18e9ff]/30 bg-[rgba(8,17,22,0.9)] text-[#d9fbff] shadow-[inset_0_0_0_1px_rgba(24,233,255,0.06)] hover:border-[#18e9ff]/45 hover:bg-[rgba(9,23,28,0.94)]',
    outline:
      'border border-[#18e9ff]/45 bg-transparent text-[#18e9ff] shadow-[inset_0_0_0_1px_rgba(24,233,255,0.08)] hover:bg-[rgba(24,233,255,0.06)]',
    ghost: 'bg-transparent text-[#d9fbff] hover:bg-white/5',
    neon:
      'border border-[#8cf6ff]/70 bg-[linear-gradient(135deg,rgba(18,28,96,0.92),rgba(19,28,60,0.9))] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_0_24px_rgba(0,238,255,0.2),0_24px_60px_-28px_rgba(0,0,0,0.75)] hover:border-[#b4fbff] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_36px_rgba(0,238,255,0.28),0_24px_60px_-24px_rgba(0,0,0,0.75)]',
    panel:
      'border border-white/10 bg-[rgba(6,13,19,0.84)] text-white backdrop-blur-xl hover:bg-[rgba(8,18,24,0.92)]',
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled ? 1 : 1.015, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.985 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {isLoading && (
        <motion.div
          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
