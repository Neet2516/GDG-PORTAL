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
        <label
          className={`font-manrope text-[0.76rem] font-bold uppercase tracking-[0.24em] ${
            hasError ? 'text-[#ff3f86]' : 'text-[#9ceff2]'
          }`}
        >
          {label}
          {required && <span className="ml-1 font-bold text-[#ff3f86]">*</span>}
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
          w-full rounded-xl border px-4 py-3.5 font-manrope text-base font-medium
          bg-[rgba(7,20,22,0.96)] text-white placeholder:text-white/28 transition-all duration-300
          focus:outline-none
          ${
            hasError
              ? 'border-[#ff3f86]/55 shadow-[inset_0_0_0_1px_rgba(255,63,134,0.18)] focus:border-[#ff3f86] focus:shadow-[0_0_0_4px_rgba(255,63,134,0.1)]'
              : 'border-[#18e9ff]/14 shadow-[inset_0_0_0_1px_rgba(24,233,255,0.08)] focus:border-[#18e9ff] focus:shadow-[0_0_0_4px_rgba(24,233,255,0.1)]'
          }
          ${disabled ? 'cursor-not-allowed opacity-60' : ''}
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
            <p className="flex items-center gap-1 text-sm font-medium text-[#ff3f86]">
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
            <span className="text-white/56">{helperText}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
