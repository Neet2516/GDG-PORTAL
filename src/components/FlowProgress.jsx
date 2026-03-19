export const FlowProgress = ({
  steps = [],
  currentStep = 0,
  label = 'Progress',
  className = '',
}) => {
  const percentage = steps.length ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-manrope text-[0.7rem] font-bold uppercase tracking-[0.3em] text-primary">
            {label}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-on-surface md:text-3xl">
            {steps[currentStep]?.title}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p className="mt-1 text-xs font-semibold text-primary">{percentage}% complete</p>
        </div>
      </div>
      <div className="flex gap-1">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              index <= currentStep ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {steps.map((step, index) => (
          <div key={step.id} className="space-y-1">
            <p
              className={`text-[0.7rem] font-semibold uppercase tracking-[0.22em] ${
                index === currentStep ? 'text-primary' : 'text-on-surface-variant/70'
              }`}
            >
              {step.kicker}
            </p>
            <p className="text-sm text-on-surface-variant">{step.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowProgress;
