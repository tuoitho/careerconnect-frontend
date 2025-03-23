import React from 'react';

const LoadingSpinner2 = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
      <div className="flex items-center justify-center p-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner2;