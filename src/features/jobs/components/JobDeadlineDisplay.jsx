import React from 'react';
import { CalendarDays } from "lucide-react";
import { formatDate } from '../utils/formatters';

/**
 * Component to display job deadline information
 * @param {string|Date} deadline - The job application deadline
 */
const JobDeadlineDisplay = ({ deadline }) => {
  return (
    <div className="flex items-center text-sm text-gray-600">
      <CalendarDays className="w-4 h-4 mr-2 text-green-500" />
      Deadline: {formatDate(deadline)}
    </div>
  );
};

export default JobDeadlineDisplay;