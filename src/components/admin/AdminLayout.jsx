import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AuthContext from '../../context/AuthContext';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { logout, user } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <header className="bg-white shadow-sm fixed right-0 left-64 z-10">
            <div className="px-4 py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="text-sm text-gray-700 mr-4">
                    Xin chào, {user.fullName || user.username}
                  </div>
                )}
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                  title="Đăng xuất"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>
          <main className="pt-16 p-6">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout