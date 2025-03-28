import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DEFAULT_ROUTES } from "../route/defaultroutes";
// import AuthContext from "../context/AuthContext"; // Removed AuthContext
// import { useContext } from "react"; // Removed useContext
import { useSelector } from 'react-redux'; // Added useSelector
import { selectCurrentUser } from '../store/slices/authSlice'; // Import Redux selector

const NotFound = () => {
  // const { user } = useContext(AuthContext); // Removed context usage
  const user = useSelector(selectCurrentUser); // Get user from Redux
  const navigate = useNavigate();
  const location = useLocation();
  const role = user?.role?.toLowerCase(); // Use user from Redux store

  const handleHomeClick = () => {
    // Điều hướng về trang mặc định theo role
    if (role && DEFAULT_ROUTES[role]) {
      navigate(DEFAULT_ROUTES[role]);
    } else {
      navigate("/login"); // Fallback nếu không có role hoặc role không hợp lệ
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12h6m-3 -3v6m-7 4h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-8">Sorry, page not found.</p>

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

export default NotFound;
