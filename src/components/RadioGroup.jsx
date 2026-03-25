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
        <label
          className={`font-manrope text-[0.76rem] font-bold uppercase tracking-[0.24em] ${
            hasError ? 'text-[#ff3f86]' : 'text-[#9ceff2]'
          }`}
        >
          {label}
          {required && <span className="ml-1 font-bold text-[#ff3f86]">*</span>}
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
              group flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-all duration-200
              ${
                value === option.value
                  ? 'border-[#18e9ff]/45 bg-[rgba(7,20,22,0.96)] text-white shadow-[0_0_0_1px_rgba(24,233,255,0.08)]'
                  : 'border-[#18e9ff]/14 bg-[rgba(7,20,22,0.92)] hover:border-[#18e9ff]/28'
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
                    ? 'bg-[#18e9ff]'
                    : 'bg-[rgba(0,0,0,0.55)] shadow-[inset_0_0_0_1px_rgba(24,233,255,0.24)] group-hover:shadow-[inset_0_0_0_1px_rgba(24,233,255,0.4)]'
                }`}
              >
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="h-2 w-2 rounded-full bg-[#031214]"
                  />
                )}
              </div>
            </div>
            <span className={`font-manrope text-sm font-medium ${
              value === option.value ? 'text-white' : 'text-white/82'
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

export default RadioGroup;
