import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaBuilding, FaBriefcase, FaMoneyBill } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/users', label: 'Quản lý người dùng', icon: FaUsers },
    { path: '/admin/companies', label: 'Quản lý công ty', icon: FaBuilding },
    { path: '/admin/jobs', label: 'Quản lý tin tuyển dụng', icon: FaBriefcase },
    { path: '/admin/transactions', label: 'Quản lý giao dịch', icon: FaMoneyBill },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-8 text-center">Admin Dashboard</div>
      <nav>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Icon className="text-xl" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;