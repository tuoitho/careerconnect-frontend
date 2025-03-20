import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useJobService } from "../services/jobServiceWithHook";
import { Briefcase, ChevronDown, ChevronUp, Calendar, Clock } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

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

const AppliedJobWithHook = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sử dụng hook useJobService
  const jobService = useJobService();

  useEffect(() => {
    fetchAppliedJobs();
  }, [currentPage]);

  const fetchAppliedJobs = async () => {
    try {
      // Sử dụng execute từ hook
      const response = await jobService.getAllAppliedJobs.execute(currentPage, 3);
      
      if (response && response.result) {
        setAppliedJobs(response.result.data || []);
        setCurrentPage(response.result.currentPage || 0);
        setTotalPages(response.result.totalPages || 0);
      }
    } catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Sử dụng loading state từ hook
  if (jobService.getAllAppliedJobs.loading) {
    return <LoadingSpinner message="Loading applied jobs..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>
      
      {/* Hiển thị lỗi nếu có */}
      {jobService.getAllAppliedJobs.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {jobService.getAllAppliedJobs.error.message || "An error occurred"}
        </div>
      )}

      {/* Danh sách công việc đã ứng tuyển */}
      {appliedJobs.length > 0 ? (
        <div className="space-y-4">
          {appliedJobs.map((job) => (
            <AppliedJobItem key={job.id} job={job} />
          ))}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 mx-1 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">You haven't applied to any jobs yet.</p>
        </div>
      )}
    </div>
  );
};

export default AppliedJobWithHook;