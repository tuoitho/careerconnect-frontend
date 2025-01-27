import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <p className="text-2xl text-gray-400 mb-8">Page not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;