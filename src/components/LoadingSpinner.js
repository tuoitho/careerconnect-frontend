import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-20 h-20 border-8 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-700 font-semibold text-lg">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
