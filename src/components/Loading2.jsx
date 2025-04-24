import React from "react";

const Loading2 = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />
      <div className="relative flex items-center justify-center w-24 h-12 isolate">
        <div
          className="absolute w-7 h-7 bg-[#25f4ee] rounded-full mix-blend-multiply contrast-[250%] animate-[tiktok-bounce-left_1s_infinite_cubic-bezier(0.455,0.03,0.515,0.955)]"
          style={{
            animationName: 'tiktok-bounce-left',
          }}
        />
        <div
          className="absolute w-7 h-7 bg-[#fe2c55] rounded-full mix-blend-multiply contrast-[250%] animate-[tiktok-bounce-right_1s_infinite_cubic-bezier(0.455,0.03,0.515,0.955)]"
          style={{
            animationName: 'tiktok-bounce-right',
          }}
        />
      </div>
    </div>
  );
};


export default Loading2;