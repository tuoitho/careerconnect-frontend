import React from 'react';
import { Tag } from "lucide-react";

/**
 * Component to display job category information
 * @param {string} category - The job category
 */
const JobCategoryDisplay = ({ category }) => {
  return (
    <div className="flex items-center">
      <Tag className="w-4 h-4 mr-2 text-green-500" />
      <p className="text-sm text-gray-700">
        <span className="font-medium text-green-700">Category:</span> {category}
      </p>
    </div>
  );
};

export default JobCategoryDisplay;