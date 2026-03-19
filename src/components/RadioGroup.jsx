/**
 * RadioGroup Component
 * Reusable radio button group with validation feedback
 */

import { motion, AnimatePresence } from 'framer-motion';

export const RadioGroup = ({
  label,
  error,
  isTouched,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  name,
  className = '',
  direction = 'horizontal',
  ...props
}) => {
  const hasError = isTouched && error;

  return (
    <div className="w-full space-y-3">
      {label && (
        <label className={`block px-1 text-sm font-semibold ${hasError ? 'text-error' : 'text-on-surface-variant'}`}>
          {label}
          {required && <span className="ml-1 font-bold text-error">*</span>}
        </label>
      )}

      <div
        className={`
          flex gap-3
          ${direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
          ${className}
        `}
      >
        {options.map((option, index) => (
          <motion.label
            key={option.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className={`
              group flex items-center gap-3 rounded-xl p-3.5 transition-all duration-200
              ${
                value === option.value
                  ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-[inset_0_0_0_1px_rgba(0,88,189,0.08)]'
                  : 'bg-surface-container-low hover:bg-surface-container'
              }
              ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            `}
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
                className="sr-only"
                {...props}
              />
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-200 ${
                  value === option.value
                    ? 'bg-primary'
                    : 'bg-surface-container-lowest shadow-[inset_0_0_0_1px_rgba(194,198,213,0.35)] group-hover:shadow-[inset_0_0_0_1px_rgba(0,88,189,0.28)]'
                }`}
              >
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="h-2 w-2 rounded-full bg-white"
                  />
                )}
              </div>
            </div>
            <span className={`font-inter text-sm font-medium ${
              value === option.value ? 'text-on-primary-fixed-variant' : 'text-on-surface'
            }`}>
              {option.label}
            </span>
          </motion.label>
        ))}
      </div>

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
      </AnimatePresence>
    </div>
  );
};

export default RadioGroup;
