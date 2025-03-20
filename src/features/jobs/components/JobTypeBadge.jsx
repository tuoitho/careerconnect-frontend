import React from 'react';

/**
 * Component to display job type as a badge
 * @param {string} type - The job type
 */
const JobTypeBadge = ({ type }) => {
  return (
    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
      {type}
    </span>
  );
};

export default JobTypeBadge;