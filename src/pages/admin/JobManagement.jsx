import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchJobs = async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getAllJobs(page);
      // Updated to match the new response structure
      setJobs(response.result.data);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
      setCurrentPage(response.result.currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApproveJob = async (jobId) => {
    try {
      await adminService.approveJob(jobId);
      toast.success('Phê duyệt tin tuyển dụng thành công');
      fetchJobs(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi phê duyệt tin tuyển dụng');
    }
  };

  const handleHideJob = async (jobId) => {
    try {
      await adminService.hideJob(jobId);
      toast.success('Ẩn tin tuyển dụng thành công');
      fetchJobs(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi ẩn tin tuyển dụng');
    }
  };

  const handleShowJob = async (jobId) => {
    try {
      await adminService.showJob(jobId);
      toast.success('Hiển thị tin tuyển dụng thành công');
      fetchJobs(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi hiển thị tin tuyển dụng');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý tin tuyển dụng</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        !job.visible ? 'bg-red-100 text-red-800' : 
                        job.approved ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {!job.visible ? 'Đã ẩn' : job.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!job.approved && (
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Phê duyệt
                        </button>
                      )}
                      {job.visible && (
                        <button
                          onClick={() => handleHideJob(job.id)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          Ẩn
                        </button>
                      )}
                      {!job.visible && (
                        <button
                          onClick={() => handleShowJob(job.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Hiển thị
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default JobManagement;