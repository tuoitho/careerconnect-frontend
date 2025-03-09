import React, { useState, useEffect } from "react";
import { jobService } from "../services/jobService";
import { MapPin, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function JobSearch() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") || "");
  const [filters, setFilters] = useState({
    location: searchParams.get("location") || "",
    category: "",
    type: "",
    salary: "",
  });
  const [totalPages, setTotalPages] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState([]); // State để lưu các gợi ý tìm kiếm
  const [showSearchResults, setShowSearchResults] = useState(false); // State để kiểm soát việc hiển thị dropdown
  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setShowSearchResults(true); // Show dropdown when typing

    // Clear existing timeout
    clearTimeout(searchTimeout);

    // Set new timeout for search
    setSearchTimeout(
      setTimeout(() => {
        if (newSearchTerm.trim()) {
          // Only fetch if there's actual input
          fetchSearchSuggestions(newSearchTerm);
        } else {
          setSearchSuggestions([]); // Clear suggestions if input is empty
        }
      }, 300)
    );
  };
  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
    setShowSearchResults(false); // Đóng dropdown sau khi click
  };
  // Hàm fetch dữ liệu gợi ý tìm kiếm
  const fetchSearchSuggestions = async (term) => {
    try {
      const response = await jobService.searchJobs({
        query: term,
        page: 0,
        size: 5, // Lấy 5 kết quả đầu tiên
      });
      setSearchSuggestions(response.result.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, [ currentPage]);
  // Update fetchJobs to use the URL parameters
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.searchJobs({
        query: searchTerm,
        page: currentPage,
        ...filters,
      });
      setJobs(response.result.data);
      setTotalPages(response.result.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when component mounts or when search params change
  useEffect(() => {
    if (searchParams.get("query") !== searchTerm) {
      fetchJobs();
    }
  }, [currentPage, filters]);

  useEffect(() => {
    document.getElementById("search").focus();
  }, []);
  const navigate = useNavigate();

  // Xử lý khi input được focus
  const handleInputFocus = () => {
    setShowSearchResults(true);
    if (searchTerm.trim()) {
      // Fetch suggestions if there's text when focusing
      fetchSearchSuggestions(searchTerm);
    }
  };

  const handleApply = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // setCurrentPage(0); // Reset to first page on new search
    setShowSearchResults(false);
    // fetchJobs();
    // chuyển qua trang brower job và tự bấm nút search
    navigate(`/BrowertJobPage?query=${searchTerm}`);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed search bar at top */}
      <div className="bg-black p-4 sticky top-0 left-0 right-0 z-10 shadow-lg">
        <div className="flex gap-2 bg-white p-3 rounded-lg items-center max-w-7xl mx-auto">
          <div className="flex-1 flex items-center gap-2 border-r border-gray-300 pr-2 ">
            <Search className="text-gray-400" size={20} />

            <input
              id="search"
              type="text"
              placeholder="Job title or keyword"
              value={searchTerm}
              onChange={handleSearchTermChange} // Thay đổi này
              className="w-full focus:outline-none text-black text-sm"
              onFocus={handleInputFocus}
              onBlur={() => {
                setTimeout(() => setShowSearchResults(false), 200);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-2 ">
            <MapPin className="text-gray-400" size={20} />
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-48 focus:outline-none text-black text-sm bg-transparent"
            >
              <option value="">All Locations</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
            </select>
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 pt-4 ">
        <div className="bg-black rounded-lg shadow-md mb-8 relative">
          {/* Dropdown hiển thị gợi ý tìm kiếm */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-green-500/20 shadow-lg rounded-lg mt-2 overflow-hidden transition-all duration-200 ease-in-out">
              {/* Chiều cao cố định 440px */}
              <div className="max-h-[440px] min-h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-gray-50 flex-1">
                {loading ? (
                  <div className="h-[88px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  <div className="divide-y divide-green-100">
                    {searchSuggestions.map((job) => (
                      <div
                        key={job.jobId}
                        onClick={() => handleJobClick(job.jobId)}
                        className="p-4 h-[88px] hover:bg-green-50 transition-colors duration-150 cursor-pointer group flex items-start space-x-4"
                      >
                        <div className="w-12 h-12 rounded-lg border border-green-100 bg-white flex-shrink-0 overflow-hidden">
                          <img
                            src={job.companyLogo || "/default-company-logo.png"}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center text-gray-500 text-sm">
                              <MapPin
                                size={14}
                                className="mr-1 text-green-500"
                              />
                              {job.location}
                            </span>
                            <span className="text-green-600 text-sm font-medium">
                              {job.companyName}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[88px] flex items-center justify-center">
                    <div className="animate-fade-in-up">
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          className="w-8 h-8 text-gray-400 animate-bounce"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <p className="text-gray-500 animate-fade-in">
                          No matching jobs found
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.jobId}
                className="bg-white rounded-lg shadow-md p-6 flex items-start hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0 mr-6">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 mt-1">{job.location}</p>
                      <p className="text-green-600 font-medium mt-1">
                        {job.companyName}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApply(job.jobId)}
                      className="ml-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      View Detail
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Salary:</span> $
                      {job.minSalary} - ${job.maxSalary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && jobs.length > 0 && (
          <div className="mt-8 flex justify-between items-center">
            <p className="text-gray-600">
              Showing page {currentPage + 1} of {totalPages}
            </p>
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === index
                      ? "bg-green-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSearch;
