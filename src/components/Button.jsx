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
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-manrope font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50';

  const sizeStyles = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3 text-sm md:text-base',
    lg: 'px-6 py-3.5 text-base md:px-8 md:py-4',
  };

  const variantStyles = {
    primary:
      'primary-gradient text-on-primary shadow-[0_24px_50px_-24px_rgba(0,88,189,0.55)] hover:shadow-[0_28px_60px_-24px_rgba(0,88,189,0.62)]',
    secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest',
    outline:
      'bg-surface-container-lowest text-primary shadow-[inset_0_0_0_1px_rgba(194,198,213,0.35)] hover:bg-surface',
    ghost: 'bg-transparent text-on-primary-fixed-variant hover:bg-surface-container-low',
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
