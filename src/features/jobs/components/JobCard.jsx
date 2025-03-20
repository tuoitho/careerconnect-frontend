import React from 'react';
import { Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import modular components
import JobTypeBadge from './JobTypeBadge';
import JobLocationDisplay from './JobLocationDisplay';
import JobSalaryDisplay from './JobSalaryDisplay';
import JobCategoryDisplay from './JobCategoryDisplay';
import JobDeadlineDisplay from './JobDeadlineDisplay';

/**
 * JobCard component displays job information in a card format
 * @param {Object} job - The job object containing all job details
 */
const JobCard = ({ job }) => {
  const navigate = useNavigate();
  
  const handleJobClick = () => {
    navigate(`/job/${job.jobId}`);
  }
  
  const handleApplyClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/job/${job.jobId}`); // Navigate to job details with focus on apply
  }

  return (  
    <div 
      className="bg-white rounded-lg shadow-md p-4 m-2 hover:shadow-green-400 transition-shadow duration-300 border border-green-200 cursor-pointer"
      onClick={handleJobClick}
    >  
      <div className="flex justify-between items-start mb-3">  
        <div>  
          <h3 className="text-xl font-semibold text-green-600">{job.title}</h3>  
          <JobLocationDisplay location={job.location} />
        </div>  
        <JobTypeBadge type={job.type} />
      </div>  

      <div className="mb-4">  
        <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>  
      </div>  

      <div className="grid grid-cols-2 gap-3 mb-4">  
        <JobSalaryDisplay minSalary={job.minSalary} maxSalary={job.maxSalary} />
        <JobCategoryDisplay category={job.category} />
      </div>  

      <div className="flex justify-between items-center pt-3 border-t border-green-100">  
        <JobDeadlineDisplay deadline={job.deadline} />
        <button 
          className="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition-colors duration-300 text-sm font-medium flex items-center"
          onClick={handleApplyClick}
        >  
          <Briefcase className="w-4 h-4 mr-2" />  
          Apply Now  
        </button>  
      </div>  
    </div>  
  );
};

export default JobCard;