import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCompanies = async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getAllCompanies(page);
      setCompanies(response.result.data);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách công ty');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApproveCompany = async (companyId) => {
    try {
      await adminService.approveCompany(companyId);
      toast.success('Phê duyệt công ty thành công');
      fetchCompanies(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi phê duyệt công ty');
    }
  };

  const handleLockCompany = async (companyId) => {
    try {
      await adminService.lockCompany(companyId);
      toast.success('Khóa công ty thành công');
      fetchCompanies(currentPage);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi khóa công ty');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Quản lý công ty</h1>
      
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên công ty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${company.locked ? 'bg-red-100 text-red-800' : company.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {company.locked ? 'Đã khóa' : company.approved ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!company.approved && (
                        <button
                          onClick={() => handleApproveCompany(company.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Phê duyệt
                        </button>
                      )}
                      {!company.locked && (
                        <button
                          onClick={() => handleLockCompany(company.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Khóa
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

export default CompanyManagement;