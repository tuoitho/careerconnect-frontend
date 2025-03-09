import React from 'react';
import { CalendarDays, MapPin, Briefcase, DollarSign, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  
  const formatSalary = (min, max) => {  
    return `${min && min !== "0" ? `$${min}` : ""} ${max && max !== "0" ? `- $${max}` : ""}`.trim() || "Thỏa thuận"  
  }
  
  const handleJobClick = () => {
    navigate(`/candidate/job/${job.jobId}`);
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-green-400 transition-shadow duration-300 border border-green-200 cursor-pointer"
      onClick={handleJobClick}
    >
      <div className="flex items-center">
        <div className="mr-4">
          <img 
            src={job.companyLogo || "/placeholder-logo.png"} 
            alt={job.companyName} 
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-600">{job.title}</h3>
          <p className="text-gray-600">{job.companyName}</p>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4 mr-1 text-green-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <DollarSign className="w-4 h-4 mr-1 text-green-500" />
            <span>Lương: {formatSalary(job.minSalary, job.maxSalary)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;