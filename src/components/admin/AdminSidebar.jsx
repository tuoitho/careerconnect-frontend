import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaBuilding, FaBriefcase, FaMoneyBill, FaChartLine } from 'react-icons/fa';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/users', label: 'Quản lý người dùng', icon: FaUsers },
    { path: '/admin/companies', label: 'Quản lý công ty', icon: FaBuilding },
    { path: '/admin/jobs', label: 'Quản lý tin tuyển dụng', icon: FaBriefcase },
    { path: '/admin/transactions', label: 'Quản lý giao dịch', icon: FaMoneyBill },
  ];

  return (
    <div 
      className={`w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed h-full transition-all duration-300 shadow-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-center space-x-3">
          <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            CareerConnect
          </span>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600 shadow-lg shadow-blue-500/30' 
                  : 'hover:bg-gray-700/50 hover:translate-x-1'}`}
            >
              <Icon className={`text-xl transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
              <span className={`font-medium transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;