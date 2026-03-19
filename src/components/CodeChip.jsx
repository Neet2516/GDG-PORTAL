export const CodeChip = ({ children, className = '' }) => (
  <code
    className={`inline-flex items-center rounded-md bg-surface-container-high px-2.5 py-1 font-mono text-[0.72rem] font-semibold text-on-primary-fixed-variant ${className}`}
  >
    {children}
  </code>
);

export default CodeChip;
