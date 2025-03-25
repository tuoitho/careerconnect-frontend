import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DEFAULT_ROUTES } from '../route/defaultroutes';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
const Unauthorized = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role?.toLowerCase();
  const handleHomeClick = () => {
    // Điều hướng về trang mặc định theo role
    if (role && DEFAULT_ROUTES[role]) {
      navigate(DEFAULT_ROUTES[role]);
    } else {
      navigate('/login'); // Fallback nếu không có role hoặc role không hợp lệ
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, you don't have permission to access this page.
        </p>
        
        <button
          onClick={() => handleHomeClick()}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;