import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Processing...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;