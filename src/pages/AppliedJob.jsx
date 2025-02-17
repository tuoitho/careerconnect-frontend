import { useState, useEffect } from "react";
import { format } from "date-fns";
import { jobService } from "../services/jobService";
import { toast } from "react-toastify";
import { Briefcase, ChevronDown, ChevronUp, Calendar, Clock } from "lucide-react";

const AppliedJobItem = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxCoverLetterLength = 100;

  const toggleExpand = (e) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="group">
      <a
        href={`/job/${job.job.jobId}`}
        className="block"
        target="_blank"
        rel="noreferrer"
      >
        <div className="bg-white border-2 border-emerald-100 rounded-xl p-6 mb-4 transition-all duration-300 hover:border-emerald-500 hover:shadow-lg relative">
          {/* Badge Applied với dấu tích */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center px-3 py-1 bg-emerald-500 text-white rounded-full shadow-md transform transition-all duration-300 hover:scale-105">
              <span className="text-sm font-medium mr-1">Applied</span>
              <div className="w-5 h-5 bg-white text-emerald-500 rounded-full flex items-center justify-center">
                <svg 
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {job.job.image ? (
                <img
                  src={job.job.image}
                  alt={job.job.title}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-emerald-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-emerald-600" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {job.job.title}
              </h2>
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center text-blue-800 font-medium text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {format(new Date(job.appliedAt), "PPP")}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                  Cover Letter
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {isExpanded
                    ? job.coverLetter
                    : `${job.coverLetter.slice(0, maxCoverLetterLength)}${
                        job.coverLetter.length > maxCoverLetterLength ? "..." : ""
                      }`}
                </p>
                {job.coverLetter.length > maxCoverLetterLength && (
                  <button
                    onClick={toggleExpand}
                    className="flex items-center text-emerald-600 hover:text-emerald-700 mt-2 text-sm font-medium"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show more
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

const AppliedJobsList = () => {
  const [appliedJobs, setAppliedJobs] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppliedJobs(currentPage);
  }, [currentPage]);

  const fetchAppliedJobs = async (page) => {
    setIsLoading(true);
    try {
      const response = await jobService.getAllAppliedJobs(page);
      const data = response.result;
      setAppliedJobs(data);
    } catch (error) {
      toast.error(error.response.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!appliedJobs || appliedJobs.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <Briefcase className="w-16 h-16 text-emerald-200 mb-4" />
        <p className="text-xl font-medium">No applied jobs found</p>
        <p className="text-sm mt-2">Start applying to see your applications here</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Briefcase className="w-8 h-8 mr-3 text-emerald-600" />
        Applied Jobs
      </h1>

      <div className="space-y-6">
        {appliedJobs.data.map((job) => (
          <AppliedJobItem key={job.applicationId} job={job} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <nav className="inline-flex rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border-r border-emerald-100 bg-white text-sm font-medium text-gray-700 hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            Previous
          </button>
          
          {[...Array(appliedJobs.totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-4 py-2 border-r border-emerald-100 text-sm font-medium
                ${
                  currentPage === index
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-white text-gray-700 hover:bg-emerald-50"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(appliedJobs.totalPages - 1, currentPage + 1))}
            disabled={currentPage === appliedJobs.totalPages - 1}
            className="px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-emerald-50 disabled:opacity-50 disabled:hover:bg-white"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AppliedJobsList;