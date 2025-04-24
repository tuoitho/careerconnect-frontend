import React from 'react';
import JobCardSearch from './JobCardSearch.jsx';

const JobList = ({ jobs, totalPages, currentPage, onPageChange }) => {
  // Generate an array of page numbers
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex-grow p-4">
      {jobs.length === 0 ? (
        <p className="text-gray-600 text-center py-8">Không tìm thấy công việc nào.</p>
      ) : (
        <>
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCardSearch key={job.jobId} job={job} />
            ))}
          </div>

          {/* Custom Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                {/* Previous button */}
                <button
                  onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  &laquo;
                </button>

                {/* Page numbers */}
                {pageNumbers.map(page => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === totalPages - 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  &raquo;
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;
