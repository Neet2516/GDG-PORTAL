/**
 * Input Component
 * Reusable input with validation feedback
 */

import { motion, AnimatePresence } from 'framer-motion';

export const Input = ({
  label,
  error,
  isTouched,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  name,
  className = '',
  helperText,
  ...props
}) => {
  const hasError = isTouched && error;

  return (
    <div className="w-full space-y-2.5">
      {label && (
        <label className={`block px-1 text-sm font-semibold ${hasError ? 'text-error' : 'text-on-surface-variant'}`}>
          {label}
          {required && <span className="ml-1 font-bold text-error">*</span>}
        </label>
      )}

      <motion.input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        whileFocus={{ y: -1 }}
        transition={{ duration: 0.2 }}
        className={`
          w-full rounded-xl border-0 px-4 py-3.5 font-inter text-base font-medium
          text-on-surface placeholder:text-on-surface-variant/45 transition-all duration-300
          focus:outline-none
          ${
            hasError
              ? 'bg-surface-container-lowest shadow-[inset_0_-2px_0_0_rgba(186,26,26,0.35)] focus:shadow-[0_0_0_4px_rgba(186,26,26,0.08),inset_0_-2px_0_0_rgba(186,26,26,0.45)]'
              : 'bg-surface-container-lowest shadow-[0_0_0_1px_rgba(194,198,213,0.18)] focus:shadow-[0_0_0_4px_rgba(0,88,189,0.12)]'
          }
          ${disabled ? 'cursor-not-allowed bg-surface-container-low opacity-60' : ''}
          ${className}
        `}
        {...props}
      />

      <AnimatePresence mode="wait">
        {hasError && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="flex items-center gap-1 text-sm font-medium text-error">
              <span className="text-base">!</span>
              {error}
            </p>
          </motion.div>
        )}
        {helperText && !hasError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-on-surface-variant/80"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
