import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import Loading2 from '../../components/Loading2';
import Pagination from '../../components/atoms/Pagination';
import UserDetailModal from '../../components/admin/UserDetailModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(page);
      setUsers(response.result.data);
      setTotalPages(response.result.totalPages);
      setTotalElements(response.result.totalElements);
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLockUser = async (userId, e) => {
    e.stopPropagation();
    setLoadingAction(true);
    try {
      const response = await adminService.lockUser(userId);
      toast.success(response.message);
      setIsModalOpen(false);
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId? { ...user, locked: true } : user)));
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi khóa tài khoản');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUnlockUser = async (userId, e) => {
    e.stopPropagation();
    setLoadingAction(true);
    try {
      const response = await adminService.unlockUser(userId);
      toast.success(response.message);
      setIsModalOpen(false);
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId? {...user, locked: false } : user)));
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi mở khóa tài khoản');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {loadingAction && <Loading2 />}
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>
      
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.locked ? 'Đã khóa' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {loadingAction ? (
                        // <Loading2 />
                        null
                      ) : user.locked ? (
                        <button
                          onClick={(e) => handleUnlockUser(user.id, e)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Mở khóa
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleLockUser(user.id, e)}
                          className="text-red-600 hover:text-red-900 mr-4"
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

          <UserDetailModal
            user={selectedUser}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

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

export default UserManagement;