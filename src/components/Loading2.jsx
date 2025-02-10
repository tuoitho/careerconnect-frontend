import React from "react";

const Loading2 = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Lớp phủ mờ */}
      <div className="absolute inset-0 bg-gray-800/40 backdrop-blur-sm"></div>

      {/* Container chính */}
      <div className="relative flex items-center justify-center w-24 h-12 isolate">
        {/* Circle 1 */}
        <div className="absolute w-11 h-11 bg-[#2cf4ef] rounded-full animate-tiktok-bounce-left mix-blend-multiply"></div>
        
        {/* Circle 2 */}
        <div className="absolute w-11 h-11 bg-[#fe335a] rounded-full animate-tiktok-bounce-right mix-blend-multiply"></div>

       
      </div>

      
    </div>
  );
};

export default Loading2;
