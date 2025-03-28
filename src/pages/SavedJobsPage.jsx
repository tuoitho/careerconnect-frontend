import React, { useState, useEffect } from 'react'; // Removed useContext
import { useSelector } from 'react-redux'; // Added useSelector
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import apiService from '../api/apiService';
// import AuthContext from '../context/AuthContext'; // Removed AuthContext
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice'; // Import Redux selectors
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  // const { user, isAuthenticated } = useContext(AuthContext); // Removed context usage
  const isAuthenticated = useSelector(selectIsAuthenticated); // Get auth state from Redux
  const user = useSelector(selectCurrentUser); // Get user from Redux (though not directly used in fetch condition, good practice to have if needed later)
  const navigate = useNavigate();

  useEffect(() => {
    // Use isAuthenticated from Redux
    if (!isAuthenticated) return;
    fetchSavedJobs();
  }, [isAuthenticated]); // Dependency is now only isAuthenticated

  const fetchSavedJobs = async () => {
    try {
      const response = await apiService.get('/saved-jobs');
      setSavedJobs(response.result || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Không thể tải danh sách job đã lưu');
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await apiService.delete(`/saved-jobs/${jobId}`);
      setSavedJobs(prev => prev.filter(job => job.jobId !== jobId));
      toast.success('Đã bỏ lưu tin tuyển dụng');
    } catch (error) {
      toast.error(error.message || 'Không thể bỏ lưu tin tuyển dụng');
    }
  };

  const handleJobClick = (jobId) => {
    // navigate(`/job/${jobId}`);
    // open link in new tab
    window.open(`/job/${jobId}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bookmark className="text-blue-500" />
        Tin tuyển dụng đã lưu ({savedJobs.length})
      </h1>

      {savedJobs.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Bạn chưa lưu tin tuyển dụng nào.
        </div>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map(job => (
            <div
              key={job.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleJobClick(job.jobId)}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">{job.jobTitle}</h3>
                <p className="text-gray-600">{job.companyName}</p>
                <p className="text-sm text-gray-500">
                  Lưu vào: {new Date(job.savedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={job.companyLogo || '/api/placeholder/40/40'}
                  alt="company logo"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking delete
                    handleUnsaveJob(job.jobId);
                  }}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                  title="Bỏ lưu"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent default navigation
                    handleJobClick(job.jobId);
                  }}
                  className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                  title="Xem chi tiết"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
