import React, { useState, useEffect } from 'react';
import JobFilter from '../api/JobFilter.jsx';
import JobList from '../api/JobList.jsx';
import apiService from '../api/apiService.js';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const BrowseJobPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get("query") || '';

  const [filters, setFilters] = useState({
    keyword: queryFromUrl,
    area: searchParams.get("location") || '',
    jobType: '',
    experience: '',
    category: '',
    minSalary: '',
    maxSalary: '',
    page: 0,
    size: 5
  });

  const [searchKeyword, setSearchKeyword] = useState(queryFromUrl);

  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchJobs = async (newFilters) => {
    setLoading(true);

    try {
      setError(null);
      const response = await apiService.get('/search/search-with-filter', {
        params: newFilters,
      });
      setJobs(response.result.data || []);
      setTotalPages(response.result.totalPages || 1);
      setCurrentPage(response.result.currentPage || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Không thể tải danh sách công việc. Vui lòng thử lại sau.');

      const startIndex = newFilters.page * newFilters.size;
      const endIndex = startIndex + newFilters.size;
      setTotalPages(Math.ceil(jobs.length / newFilters.size));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
  }, [
    filters.keyword,
    filters.area,
    filters.jobType,
    filters.experience,
    filters.category,
    filters.minSalary,
    filters.maxSalary,
    filters.page
  ]);

  const handleFilterChange = (newFilters) => {
    const newParams = new URLSearchParams();
    if (newFilters.keyword) newParams.set("query", newFilters.keyword);
    if (newFilters.area) newParams.set("location", newFilters.area);
    setSearchParams(newParams);

    setSearchKeyword(newFilters.keyword || '');

    setFilters({ ...newFilters, page: 0, size: 5 });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 0; i < totalPages; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentPage === i
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
          </button>
        );
      }
    } else {
      let startPage = Math.max(0, currentPage - Math.floor(maxVisibleButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxVisibleButtons);

      if (endPage - startPage < maxVisibleButtons) {
        startPage = Math.max(0, endPage - maxVisibleButtons);
      }

      for (let i = startPage; i < endPage; i++) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentPage === i
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 hover:bg-green-50'
            }`}
            aria-label={`Page ${i + 1}`}
          >
            {i + 1}
          </button>
        );
      }

      if (startPage > 0) {
        pageButtons.unshift(
          <span key="start-ellipsis" className="mx-1 px-3 py-1.5 text-sm font-medium text-gray-500">
            ...
          </span>
        );
      }

      if (endPage < totalPages) {
        pageButtons.push(
          <span key="end-ellipsis" className="mx-1 px-3 py-1.5 text-sm font-medium text-gray-500">
            ...
          </span>
        );
      }
    }

    return pageButtons;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Tìm kiếm công việc</h1>


          <div className="mt-2 text-sm text-gray-600">
            {filters.keyword && <span>Kết quả cho "{filters.keyword}" - </span>}
            <span>Hiển thị {jobs.length} công việc</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row p-4">
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:mr-6">
          <JobFilter onFilterChange={handleFilterChange} initKeyword={queryFromUrl}
           />
        </div>

        <div className="w-full md:w-3/4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Không tìm thấy công việc phù hợp</h3>
                  <p className="text-gray-500">Vui lòng thử với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                </div>
              ) : (
                <>
                  <JobList
                    jobs={jobs}
                    totalPages={0}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />

                  {totalPages > 0 && (
                    <div className="bg-white shadow-sm rounded-lg py-3 px-4 mt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Trang {currentPage + 1} / {totalPages}
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              currentPage === 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-green-600 hover:bg-green-50'
                            }`}
                            aria-label="Previous Page"
                            disabled={currentPage === 0}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          {renderPaginationButtons()}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`mx-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              currentPage === totalPages - 1
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-green-600 hover:bg-green-50'
                            }`}
                            aria-label="Next Page"
                            disabled={currentPage === totalPages - 1}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseJobPage;
