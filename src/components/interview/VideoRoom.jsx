import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Controls from './Controls';

const VideoRoom = () => {
  const [me, setMe] = useState('');
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [otherUser, setOtherUser] = useState('');
  const [idToCall, setIdToCall] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socketRef = useRef();

  useEffect(() => {
    // Kết nối đến máy chủ socket
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    // Yêu cầu quyền truy cập media từ người dùng
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch(error => {
        console.error("Error accessing media devices: ", error);
      });

    // Lắng nghe ID được gán
    socketRef.current.on('me', (id) => {
      setMe(id);
    });

    // Lắng nghe cuộc gọi đến
    socketRef.current.on('callUser', (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    // Xử lý khi component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    };
  }, []);

  const callUser = (id) => {
    // Tạo peer để gọi
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socketRef.current.on('callAccepted', (data) => {
      setCallAccepted(true);
      setOtherUser(data.name);
      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    
    // Tạo peer để trả lời
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on('signal', (data) => {
      socketRef.current.emit('answerCall', { 
        signal: data, 
        to: caller,
        name: name
      });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  const toggleMute = () => {
    if (stream) {
      setIsMuted(!isMuted);
      stream.getAudioTracks()[0].enabled = isMuted;
    }
  };

  const toggleVideo = () => {
    if (stream) {
      setIsVideoOff(!isVideoOff);
      stream.getVideoTracks()[0].enabled = isVideoOff;
    }
  };

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="video-room bg-gray-100 p-4 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Phòng Phỏng Vấn Online</h1>
        
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Thông tin kết nối</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nhập tên của bạn"
              className="flex-1 p-2 border rounded"
            />
            <div className="flex items-center gap-2">
              <span className="font-medium">ID của bạn:</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{me}</span>
              <CopyToClipboard text={me} onCopy={handleCopy}>
                <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {isCopied ? "Đã sao chép!" : "Sao chép ID"}
                </button>
              </CopyToClipboard>
            </div>
          </div>
          
          <div className="mt-4">
            <input 
              type="text" 
              value={idToCall} 
              onChange={(e) => setIdToCall(e.target.value)} 
              placeholder="Nhập ID người cần gọi"
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex justify-end">
              {callAccepted && !callEnded ? (
                <button 
                  onClick={leaveCall} 
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Kết thúc
                </button>
              ) : (
                <button 
                  onClick={() => callUser(idToCall)} 
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Bắt đầu phỏng vấn
                </button>
              )}
            </div>
          </div>
        </div>

        {receivingCall && !callAccepted && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-lg border-2 border-blue-500">
            <h2 className="text-lg font-semibold">
              {name || "Ai đó"} đang gọi cho bạn...
            </h2>
            <div className="mt-2 flex justify-end">
              <button 
                onClick={answerCall} 
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Trả lời
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Camera của bạn</h2>
            <div className="relative bg-black rounded-lg overflow-hidden h-80">
              {stream && (
                <video 
                  playsInline 
                  muted 
                  ref={myVideo} 
                  autoPlay 
                  className="w-full h-full object-cover"
                />
              )}
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white">Camera đã tắt</p>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-lg opacity-75">
                {name || "Bạn"}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">
              {callAccepted && !callEnded ? otherUser || "Người phỏng vấn" : "Đang chờ kết nối..."}
            </h2>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden h-80">
              {callAccepted && !callEnded && (
                <video 
                  playsInline 
                  ref={userVideo} 
                  autoPlay 
                  className="w-full h-full object-cover" 
                />
              )}
              {!callAccepted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white">Đang chờ kết nối...</p>
                </div>
              )}
              {callAccepted && !callEnded && (
                <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-lg opacity-75">
                  {otherUser || "Người phỏng vấn"}
                </div>
              )}
            </div>
          </div>
        </div>

        <Controls 
          toggleMute={toggleMute} 
          toggleVideo={toggleVideo} 
          leaveCall={leaveCall} 
          isMuted={isMuted} 
          isVideoOff={isVideoOff} 
          callAccepted={callAccepted} 
          callEnded={callEnded}
        />
      </div>
    </div>
  );
};

export default VideoRoom;