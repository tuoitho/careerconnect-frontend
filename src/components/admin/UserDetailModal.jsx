import React from 'react';
import { X } from 'lucide-react';

const UserDetailModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Thông tin người dùng</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">ID</h3>
              <p className="mt-1 text-sm text-gray-900">{user.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Họ và tên</h3>
              <p className="mt-1 text-sm text-gray-900">{user.fullName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vai trò</h3>
              <p className="mt-1 text-sm text-gray-900">{user.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
              <p className="mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${user.locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                >
                  {user.locked ? 'Đã khóa' : 'Hoạt động'}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ngày tạo tài khoản</h3>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Additional user information can be added here */}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;