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
        <label
          className={`font-manrope text-[0.76rem] font-bold uppercase tracking-[0.24em] ${
            hasError ? 'text-[#ff3f86]' : 'text-[#9ceff2]'
          }`}
        >
          {label}
          {required && <span className="ml-1 font-bold text-[#ff3f86]">*</span>}
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
            w-full appearance-none rounded-xl border px-4 py-3.5
            bg-[rgba(7,20,22,0.96)] font-manrope text-base font-medium text-white
            transition-all duration-300 focus:outline-none
            ${
              hasError
                ? 'border-[#ff3f86]/55 shadow-[inset_0_0_0_1px_rgba(255,63,134,0.18)] focus:shadow-[0_0_0_4px_rgba(255,63,134,0.1)]'
                : 'border-[#18e9ff]/14 shadow-[inset_0_0_0_1px_rgba(24,233,255,0.08)] focus:shadow-[0_0_0_4px_rgba(24,233,255,0.1)]'
            }
            ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${hasError ? '%23ff3f86' : '%2318e9ff'}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
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
            <p className="flex items-center gap-1 text-sm font-medium text-[#ff3f86]">
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
