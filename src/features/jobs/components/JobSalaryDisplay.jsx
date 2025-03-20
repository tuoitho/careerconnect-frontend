import React from 'react';
import { DollarSign } from "lucide-react";
import { formatSalary } from '../utils/formatters';

/**
 * Component to display job salary information
 * @param {string|number} minSalary - Minimum salary
 * @param {string|number} maxSalary - Maximum salary
 */
const JobSalaryDisplay = ({ minSalary, maxSalary }) => {
  return (
    <div className="flex items-center">
      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
      <p className="text-sm text-gray-700">
        <span className="font-medium text-green-700">Salary:</span> {formatSalary(minSalary, maxSalary)}
      </p>
    </div>
  );
};

export default JobSalaryDisplay;