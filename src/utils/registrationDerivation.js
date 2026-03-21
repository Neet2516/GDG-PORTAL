const BRANCH_CODE_MAP = [
  ['154', 'CSE DS'],
  ['153', 'CSE AI&ML'],
  ['169', 'CS(Hindi)'],
  ['164', 'AIML'],
  ['40', 'ME'],
  ['31', 'ECE'],
  ['21', 'EN'],
  ['13', 'IT'],
  ['12', 'CS'],
  ['11', 'CS/IT'],
  ['10', 'CSE'],
  ['00', 'Civil'],
];

export const getFirstNameSlug = (name = '') =>
  name
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase()
    .replace(/[^a-z]/g, '') || '';

export const deriveEmailFromNameAndStudentNumber = (name = '', studentNumber = '') => {
  const firstName = getFirstNameSlug(name);
  const normalizedStudentNumber = String(studentNumber).trim().replace(/\D/g, '');

  if (!firstName || !normalizedStudentNumber) return '';

  return `${firstName}${normalizedStudentNumber}@akgec.ac.in`;
};

export const deriveBranchFromStudentNumber = (studentNumber = '') => {
  const normalizedStudentNumber = String(studentNumber).trim().replace(/\D/g, '');
  if (!normalizedStudentNumber.startsWith('25') || normalizedStudentNumber.length < 4) {
    return '';
  }

  const branchSegment = normalizedStudentNumber.slice(2);
  const matchedBranch = BRANCH_CODE_MAP.find(([code]) => branchSegment.startsWith(code));

  return matchedBranch?.[1] || '';
};
