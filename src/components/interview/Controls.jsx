import React from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaPhoneSlash } from 'react-icons/fa';

const Controls = ({ 
  toggleMute, 
  toggleVideo, 
  leaveCall, 
  isMuted, 
  isVideoOff, 
  callAccepted, 
  callEnded 
}) => {
  return (
    <div className="py-4 bg-white rounded-lg shadow">
      <div className="flex justify-center items-center gap-6">
        <button 
          onClick={toggleMute} 
          className={`rounded-full p-4 ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200 transition`}
          title={isMuted ? "Bật microphone" : "Tắt microphone"}
          disabled={!callAccepted || callEnded}
        >
          {isMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
        </button>
        
        <button 
          onClick={toggleVideo} 
          className={`rounded-full p-4 ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200 transition`}
          title={isVideoOff ? "Bật camera" : "Tắt camera"}
          disabled={!callAccepted || callEnded}
        >
          {isVideoOff ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
        </button>
        
        <button 
          onClick={leaveCall} 
          className="rounded-full p-4 bg-red-500 text-white hover:bg-red-600 transition"
          title="Kết thúc cuộc gọi"
          disabled={!callAccepted || callEnded}
        >
          <FaPhoneSlash size={24} />
        </button>
      </div>
    </div>
  );
};

export default Controls;