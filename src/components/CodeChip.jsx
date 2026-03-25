export const CodeChip = ({ children, className = '' }) => (
  <code
    className={`inline-flex items-center rounded-md border border-[#18e9ff]/18 bg-[rgba(7,20,22,0.92)] px-2.5 py-1 font-mono text-[0.72rem] font-semibold text-[#9ceff2] ${className}`}
  >
    {children}
  </code>
);

export default CodeChip;
