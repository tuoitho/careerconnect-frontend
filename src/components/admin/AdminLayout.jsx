import React from 'react'; // Removed useContext
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { selectCurrentUser, logout as logoutAction } from '../../store/slices/authSlice'; // Import Redux state and action
import { FaSignOutAlt, FaBell, FaUser, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch(); // Get dispatch function
  const currentUser = useSelector(selectCurrentUser); // Get user from Redux
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  // const { logout, user } = useContext(AuthContext); // Removed context usage
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // logout(); // Removed context usage
    dispatch(logoutAction()); // Dispatch Redux logout action
  };

  // Generate breadcrumb from current path
  const getBreadcrumb = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => ({
      label: path.charAt(0).toUpperCase() + path.slice(1),
      path: '/' + paths.slice(0, index + 1).join('/')
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <header className="bg-white shadow-md fixed right-0 left-0 z-10 transition-all duration-300" style={{ left: isSidebarOpen ? '16rem' : '0' }}>
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none transition-all duration-200 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400 transition-colors duration-200"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none transition-all duration-200 hover:text-gray-700 relative">
                    <FaBell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                  </button>
                  <div className="flex items-center space-x-3 border-l pl-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                      <FaUser className="w-4 h-4" />
                    </div>
                    <div className="hidden md:block">
                      {/* Use currentUser from Redux */}
                      <div className="text-sm font-medium text-gray-700">{currentUser?.fullName || currentUser?.username}</div>
                      <div className="text-xs text-gray-500">Administrator</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-red-500 focus:outline-none transition-all duration-200"
                      title="Đăng xuất"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                {getBreadcrumb().map((item, index, array) => (
                  <React.Fragment key={item.path}>
                    <span className={index === array.length - 1 ? 'text-gray-700 font-medium' : ''}>{item.label}</span>
                    {index < array.length - 1 && <span className="mx-2">/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </header>
          <main className="pt-28 p-6">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
