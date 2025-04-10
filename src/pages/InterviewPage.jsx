import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, User, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { selectCurrentUser } from '../store/slices/authSlice';
import { interviewService } from '../services/interviewService';
import Loading2 from '../components/Loading2';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

const InterviewPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [participantLeft, setParticipantLeft] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const isInitiator = useRef(false);
  const disconnectionTimer = useRef(null);
  const iceCandidatesQueue = useRef([]);

  // Hàm gửi thông báo khi người dùng rời phỏng vấn
  const sendParticipantLeftNotification = () => {
    if (stompClient.current && stompClient.current.connected) {
      const message = { 
        interviewId, 
        type: 'participant-left', 
        data: `${currentUser.fullname || currentUser.username} đã rời khỏi phỏng vấn`
      };
      stompClient.current.send('/app/interview.message', {}, JSON.stringify(message));
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      sendParticipantLeftNotification();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const fetchInterview = async () => {
      try {
        setLoading(true);
        const response = await interviewService.getInterviewDetails(interviewId);
        setInterview(response.result);
        isInitiator.current = currentUser.role === 'RECRUITER';
      } catch (error) {
        console.error('Error fetching interview details:', error);
        setError('Không thể tải thông tin phỏng vấn. Vui lòng thử lại sau.');
        toast.error('Không thể tải thông tin phỏng vấn');
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) fetchInterview();

    return () => {
      if (peerConnection.current) peerConnection.current.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => console.log('WebSocket Disconnected'));
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (disconnectionTimer.current) clearTimeout(disconnectionTimer.current);
    };
  }, [interviewId, currentUser]);

  useEffect(() => {
    if (!loading && interview && !localStream) {
      const initialize = async () => {
        await initializeMedia();
        connectWebSocket(interview);
      };
      initialize();
    }
  }, [loading, interview]);

  const handleSignalingData = async (data) => {
    if (!peerConnection.current) {
      console.error('Peer connection not initialized');
      return;
    }
    try {
      console.log('Received signal:', data.type);
      switch (data.type) {
        case 'offer':
          if (!isInitiator.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.data));
            if (iceCandidatesQueue.current.length > 0) {
              console.log(`Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
              for (const candidate of iceCandidatesQueue.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
              }
              iceCandidatesQueue.current = [];
            }
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            sendSignal('answer', answer);
          }
          break;
        case 'answer':
          if (isInitiator.current) {
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.data));
            if (iceCandidatesQueue.current.length > 0) {
              console.log(`Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
              for (const candidate of iceCandidatesQueue.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
              }
              iceCandidatesQueue.current = [];
            }
          }
          break;
        case 'ice-candidate':
          if (data.data) {
            try {
              if (peerConnection.current.remoteDescription && peerConnection.current.remoteDescription.type) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.data));
              } else {
                console.log('Queuing ICE candidate as remote description is not set yet');
                iceCandidatesQueue.current.push(data.data);
              }
            } catch (err) {
              console.error('Error adding ICE candidate:', err);
            }
          }
          break;
        default:
          console.log('Unknown signal type:', data.type);
      }
    } catch (error) {
      console.error('Error handling signaling data:', error);
    }
  };

  const connectWebSocket = async (interviewData) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No authentication token found');

      const socket = new SockJS(`${BASE_URL}/ws-interview`);
      const client = Stomp.over(socket);
      client.debug = message => console.debug('STOMP Debug:', message);

      const headers = { Authorization: `Bearer ${token}` };
      client.connect(headers, (frame) => {
        console.log('Connected to WebSocket: ' + frame);
        client.subscribe(`/user/queue/interview/signal`, (message) => {
          handleSignalingData(JSON.parse(message.body));
        });
        client.subscribe(`/user/queue/interview/message`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log('Received message:', receivedMessage);          if (receivedMessage.type === 'participant-left') {
            setParticipantLeft(true);
            setShowEndConfirmation(true);
            // Đã loại bỏ toast notification để chỉ hiển thị modal
            disconnectionTimer.current = setTimeout(() => {
              endCall();
            }, 60000);
          } else if (receivedMessage.type === 'chat') {
            setMessages(prev => [
              ...prev,
              {
                id: Date.now(),
                sender: receivedMessage.senderId,
                senderName: receivedMessage.senderName,
                content: receivedMessage.data,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
          }
        });
        joinInterview();
      }, (error) => {
        console.error('STOMP error', error);
        setError('Không thể kết nối đến máy chủ.');
        toast.error('Không thể kết nối đến máy chủ.');
      });

      stompClient.current = client;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setError('Không thể kết nối đến máy chủ.');
      toast.error('Lỗi kết nối WebSocket: ' + error.message);
    }
  };

  const sendSignal = (type, data) => {
    if (!stompClient.current || !stompClient.current.connected) return;
    stompClient.current.send('/app/interview.signal', {}, JSON.stringify({ interviewId, type, data }));
  };

  const joinInterview = async () => {
    try {
      await interviewService.joinInterview(interviewId);
      console.log('Joined interview successfully');
    } catch (error) {
      console.error('Error joining interview:', error);
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.onloadedmetadata = () => localVideoRef.current.play().catch(e => console.error('Error playing local video:', e));
      }
      createPeerConnection();
      stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
      if (isInitiator.current) setTimeout(() => createAndSendOffer(), 2000);
      setConnectionStatus('Waiting for the other participant to join...');
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setError('Không thể truy cập camera hoặc microphone.');
      toast.error('Không thể truy cập camera hoặc microphone.');
    }
  };

  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ],
      iceCandidatePoolSize: 10,
    };
    peerConnection.current = new RTCPeerConnection(configuration);
    peerConnection.current.onicecandidate = event => event.candidate && sendSignal('ice-candidate', event.candidate);
    peerConnection.current.ontrack = event => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
      }
    };
    peerConnection.current.onconnectionstatechange = () => {
      const state = peerConnection.current.connectionState;
      console.log('Connection state changed:', state);
      if (state === 'connected') {
        setConnectionStatus('Connected');
      } else if (state === 'disconnected' || state === 'closed') {
        setConnectionStatus('Disconnected');
        if (remoteStream) { // Chỉ hiển thị nếu đã từng kết nối với remote
          setParticipantLeft(true);
          setShowEndConfirmation(true);
          toast.warning('Người tham gia khác đã rời khỏi phỏng vấn', { autoClose: false });
          disconnectionTimer.current = setTimeout(() => {
            endCall();
          }, 60000);
        }
      } else if (state === 'failed') {
        setConnectionStatus('Connection failed');
        toast.error('Kết nối thất bại.');
      } else {
        setConnectionStatus('Connecting...');
      }
    };
  };

  const createAndSendOffer = async () => {
    if (!peerConnection.current) return;
    try {
      const offer = await peerConnection.current.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
      await peerConnection.current.setLocalDescription(offer);
      sendSignal('offer', offer);
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Không thể thiết lập kết nối');
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
      setIsMuted(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
      setIsVideoOff(prev => !prev);
    }
  };

  const endCall = async () => {
    try {
      sendParticipantLeftNotification();
      await new Promise(resolve => setTimeout(resolve, 300));
      await interviewService.endInterview(interviewId);
      if (peerConnection.current) peerConnection.current.close();
      if (localStream) localStream.getTracks().forEach(track => track.stop());
      navigate(currentUser.role === 'RECRUITER' ? '/recruiter/interviews' : '/candidate/interviews');
      toast.success('Phỏng vấn kết thúc');
    } catch (error) {
      console.error('Error ending interview:', error);
      toast.error('Không thể kết thúc phỏng vấn.');
    }
  };

  const handleSendMessage = e => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient.current || !stompClient.current.connected) return;
    const message = { interviewId, type: 'chat', data: newMessage.trim() };
    stompClient.current.send('/app/interview.message', {}, JSON.stringify(message));
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: currentUser.userId, senderName: currentUser.fullname || currentUser.username, content: newMessage.trim(), timestamp: new Date().toLocaleTimeString() },
    ]);
    setNewMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <Loading2 />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-700">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Quay lại</button>
        </div>
      </div>
    );
  }
  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy phỏng vấn</h1>
          <p className="text-gray-700">Phỏng vấn không tồn tại hoặc bạn không có quyền truy cập.</p>
          <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {showEndConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start mb-4">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Người tham gia đã rời đi</h3>
                <p className="text-gray-600 mt-1">
                  Người tham gia khác đã rời khỏi cuộc phỏng vấn. Cuộc phỏng vấn sẽ tự động kết thúc sau 60 giây.
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowEndConfirmation(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Tôi đã hiểu
              </button>
              <button
                onClick={endCall}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Kết thúc ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{interview.jobTitle} - Phỏng vấn trực tuyến</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{new Date(interview.scheduledTime).toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{connectionStatus}</div>
        </div>
      </div>
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative bg-black rounded-lg overflow-hidden h-96 lg:h-[calc(100vh-16rem)]">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <User className="mx-auto w-20 h-20 text-gray-400" />
                  <p className="mt-2">Đang chờ người tham gia khác...</p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex justify-center gap-4">
            <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200`} title={isMuted ? 'Bật micro' : 'Tắt micro'}>
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200`} title={isVideoOff ? 'Bật camera' : 'Tắt camera'}>
              {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
            </button>
            <button onClick={endCall} className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700" title="Kết thúc cuộc gọi">
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="w-full lg:w-80 bg-white rounded-lg shadow-md flex flex-col h-96 lg:h-[calc(100vh-8rem)]">
          <div className="p-3 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Trò chuyện
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">Chưa có tin nhắn nào. Bắt đầu trò chuyện!</div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === currentUser.userId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] rounded-lg p-3 ${message.sender === currentUser.userId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <div className="text-xs mb-1 font-medium">{message.sender === currentUser.userId ? 'Bạn' : message.senderName}</div>
                    <p>{message.content}</p>
                    <div className="text-xs mt-1 text-right opacity-80">{message.timestamp}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" disabled={!newMessage.trim()} className={`px-3 py-2 rounded-lg ${newMessage.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;