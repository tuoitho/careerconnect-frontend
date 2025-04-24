import React from 'react';
import { MapPin } from "lucide-react";

/**
 * Component to display job location information
 * @param {string} location - The job location
 */
const JobLocationDisplay = ({ location }) => {
  return (
    <div className="flex items-center text-gray-600">
      <MapPin className="w-4 h-4 mr-2 text-green-500" />
      <p className="text-sm">{location}</p>
    </div>
  );
};

export default JobLocationDisplay;