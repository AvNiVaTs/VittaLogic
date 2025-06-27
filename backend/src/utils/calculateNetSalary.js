// utils/salaryUtils.js

/**
 * Calculates net salary based on base salary, bonuses, and deductions.
 *
 * @param {Object} data
 * @param {number} data.baseSalary - Base fixed monthly salary.
 * @param {number} data.bonus - Additional bonus (performance, festive, etc.).
 * @param {number} data.deductions - Total deductions (PF, tax, etc.).
 *
 * @returns {Object} { grossSalary, netSalary }
 */
export const calculateNetSalary = ({ baseSalary = 0, bonus = 0, deductions = 0 }) => {
  const grossSalary = baseSalary + bonus;
  const netSalary = Math.max(0, grossSalary - deductions); // prevent negative salary

  return {
    grossSalary,
    netSalary
  };
};
