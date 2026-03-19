/**
 * Select Component
 * Reusable select dropdown with validation feedback
 */

import { motion, AnimatePresence } from 'framer-motion';

export const Select = ({
  label,
  error,
  isTouched,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  name,
  className = '',
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

      <motion.div whileFocus={{ y: -1 }} transition={{ duration: 0.2 }} className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`
            w-full appearance-none rounded-xl border-0 px-4 py-3.5
            bg-surface-container-lowest font-inter text-base font-medium text-on-surface
            transition-all duration-300 focus:outline-none
            ${
              hasError
                ? 'shadow-[inset_0_-2px_0_0_rgba(186,26,26,0.35)] focus:shadow-[0_0_0_4px_rgba(186,26,26,0.08),inset_0_-2px_0_0_rgba(186,26,26,0.45)]'
                : 'shadow-[0_0_0_1px_rgba(194,198,213,0.18)] focus:shadow-[0_0_0_4px_rgba(0,88,189,0.12)]'
            }
            ${disabled ? 'cursor-not-allowed bg-surface-container-low opacity-60' : 'cursor-pointer'}
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${hasError ? '%23ba1a1a' : '%230058bd'}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1rem 1rem',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </motion.div>

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

export default Select;
