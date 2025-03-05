import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, Send, ChevronLeft } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import apiService from '../api/apiService';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const RecruiterChatPage = () => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const selectedCandidateRef = useRef(null);
  useEffect(() => {
    selectedCandidateRef.current = selectedCandidate;
  }, [selectedCandidate]);

  const [candidateMessages, setCandidateMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const stompClient = useRef(null);
  const messageAreaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user, isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const connectWebSocket = () => {
      const socket = new SockJS('http://localhost:8088/ws-chat');
      stompClient.current = Stomp.over(socket);
      const token = localStorage.getItem('authToken') || 'abc';
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      stompClient.current.connect(headers, onConnected, onError);
    };

    connectWebSocket();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedCandidate) {
      // toast.success(`Đã chọn ứng viên ${selectedCandidate.id}`);
    }
  }, [selectedCandidate]);

  const onConnected = () => {
    setConnected(true);
    // console.log('WebSocket connected with userId', user.userId);

    stompClient.current.subscribe(`/user/queue/messages`, onMessageReceived);
    // console.log(`Subscribed to /user/queue/messages`);

    stompClient.current.subscribe('/topic/chat.messageSaved', onMessageSaved);
    // console.log(`Subscribed to /topic/chat.messageSaved`);

    fetchCandidates();
  };

  const fetchCandidates = async () => {
    try {
      const response = await apiService.get('/chat/candidate-contacts'); // API cho danh sách ứng viên
      const candidates = response.result || [];
      setCandidates(candidates|| []);

      const allMessages = {};
      const unreadCounts = {};
      for (const candidate of candidates) {
        const response = await apiService.get(`/chat/history?userId2=${candidate.id}`);
        const chatHistory = response.result || [];
        const formattedMessages = chatHistory.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderId === user.userId ? 'recruiter' : 'candidate',
          timestamp: msg.timestamp || new Date().toLocaleTimeString(),
          status: msg.status,
        }));
        allMessages[candidate.id] = formattedMessages;

        unreadCounts[candidate.id] = chatHistory.filter(
          msg => msg.status !== 'READ' && msg.senderId !== user.userId
        ).length;

        const sentMessages = formattedMessages.filter(
          msg => msg.status === 'SENT' && msg.senderId !== user.userId
        );
      }

      setCandidateMessages(allMessages);
      setCandidates(prev =>
        prev.map(can => ({
          ...can,
          unread: unreadCounts[can.id] || 0,
        }))
      );
      setMessages(allMessages[response[0]?.id] || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const onMessageReceived = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    console.log('Received message:', receivedMessage);

    if (receivedMessage.type === 'CHAT') {
      const tempId = receivedMessage.tempId || Date.now();
      const senderId = receivedMessage.senderId;
      const messageData = {
        id: tempId,
        text: receivedMessage.content,
        sender: receivedMessage.senderId === user.userId ? 'recruiter' : 'candidate',
        timestamp: receivedMessage.timestamp || new Date().toLocaleTimeString(),
        status: receivedMessage.status || 'SENT',
      };

      setCandidateMessages(prev => ({
        ...prev,
        [senderId]: [
          ...(prev[senderId] || []),
          messageData,
        ],
      }));

      if (selectedCandidateRef.current && selectedCandidateRef.current.id === senderId) {
        setMessages(prev => [
          ...prev,
          messageData,
        ]);
        if (senderId !== user.userId) {
          stompClient.current.send(
            '/app/chat.markAsRead',
            { Authorization: `Bearer ${localStorage.getItem('authToken') || 'abc'}` },
            JSON.stringify({ messageId: tempId })
          );
        }
      } else {
        setCandidates(prev =>
          prev.map(can => {
            if (can.id === senderId) {
              return { ...can, unread: (can.unread || 0) + 1 };
            }
            return can;
          })
        );
      }
    }
  };

  const onMessageSaved = (payload) => {
    const savedMessage = JSON.parse(payload.body);
    console.log('Message saved:', savedMessage);

    const { id, tempId, senderId, recipientId, content, status } = savedMessage;
    const messageData = {
      id,
      text: content,
      sender: senderId === user.userId ? 'recruiter' : 'candidate',
      timestamp: new Date().toLocaleTimeString(),
      status: status || 'SENT',
    };

    // setCandidateMessages(prev => ({
    //   ...prev,
    //   [senderId]: prev[senderId].map(msg =>
    //     msg.id === tempId ? messageData : msg
    //   ),
    // }));
    setCandidateMessages(prev => ({
        ...prev,
        [senderId]: [
          ...(prev[senderId] || []),
          messageData,
        ],
      }));

    if (selectedCandidateRef.current && selectedCandidateRef.current.id === senderId) {
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? messageData : msg))
      );

      if (senderId !== user.userId) {
        console.log('Đánh dấu đã đọc: ' + JSON.stringify({ messageId: id }));
        stompClient.current.send(
          '/app/chat.markAsRead',
          {},
          JSON.stringify({ messageId: id })
        );
      }
    }

    toast.success(`Tin nhắn mới từ ${senderId}: ${content}`);
  };

  const onError = (error) => {
    console.error('Could not connect to WebSocket server:', error);
    setConnected(false);
    setTimeout(() => {
      if (stompClient.current) {
        stompClient.current.disconnect();
        connectWebSocket();
      }
    }, 5000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedCandidate && connected) {
      const chatMessage = {
        tempId: Date.now(),
        senderId: user.userId,
        recipientId: selectedCandidate.id,
        content: newMessage,
        type: 'CHAT',
      };
      stompClient.current.send(
        '/app/chat.send',
        { Authorization: `Bearer ${localStorage.getItem('authToken') || 'abc'}` },
        JSON.stringify(chatMessage)
      );

      setMessages(prev => [
        ...prev,
        {
          id: chatMessage.tempId,
          text: newMessage,
          sender: 'recruiter',
          timestamp: new Date().toLocaleTimeString(),
          status: 'SENT',
        },
      ]);
      setCandidateMessages(prev => ({
        ...prev,
        [selectedCandidate.id]: [
          ...(prev[selectedCandidate.id] || []),
          {
            id: chatMessage.tempId,
            text: newMessage,
            sender: 'recruiter',
            timestamp: new Date().toLocaleTimeString(),
            status: 'SENT',
          },
        ],
      }));
      setNewMessage('');
    }
  };

  const handleCandidateSelect = async (candidate) => {
    setSelectedCandidate(candidate);

    try {
      const response = await apiService.get(`/chat/history?userId2=${candidate.id}`);
      const chatHistory = response.result || [];
      const formattedMessages = chatHistory.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId === user.userId ? 'recruiter' : 'candidate',
        timestamp: msg.timestamp || new Date().toLocaleTimeString(),
        status: msg.status,
      }));
      setMessages(formattedMessages);
      setCandidateMessages(prev => ({
        ...prev,
        [candidate.id]: formattedMessages,
      }));

      const unreadMessages = chatHistory.filter(
        msg => msg.status !== 'READ' && msg.senderId !== user.userId
      );
      unreadMessages.forEach(msg => {
        if (stompClient.current && stompClient.current.connected) {
          stompClient.current.send(
            '/app/chat.markAsRead',
            {},
            JSON.stringify({ messageId: msg.id })
          );
          setMessages(prev =>
            prev.map(m => (m.id === msg.id ? { ...m, status: 'READ' } : m))
          );
          setCandidateMessages(prev => ({
            ...prev,
            [candidate.id]: prev[candidate.id].map(m => (m.id === msg.id ? { ...m, status: 'READ' } : m)),
          }));
        }
      });

      setCandidates(prev =>
        prev.map(c => (c.id === candidate.id ? { ...c, unread: 0 } : c))
      );
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-500" />
        Trò chuyện với Ứng viên
        {!connected && <span className="text-sm text-red-500 ml-2">(Đang kết nối lại...)</span>}
      </h1>

      <div className="flex bg-white rounded-xl shadow-lg h-[calc(100vh-160px)]">
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Ứng viên ({candidates.length})</h2>
          {candidates.map(candidate => (
            <div
              key={candidate.id}
              onClick={() => handleCandidateSelect(candidate)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedCandidate?.id === candidate.id ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={candidate.avatar || '/api/placeholder/40/40'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                {candidate.active && (
                  <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{candidate.name}</h3>
                <p className="text-sm text-gray-500 truncate">{candidate.lastMessage}</p>
              </div>
              {candidate.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {candidate.unread}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedCandidate ? (
            <>
              <div className="p-4 border-b flex items-center">
                <button
                  className="md:hidden mr-2 text-gray-600"
                  onClick={() => setSelectedCandidate(null)}
                >
                  <ChevronLeft />
                </button>
                <img
                  src={selectedCandidate.avatar || '/api/placeholder/40/40'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{selectedCandidate.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedCandidate.active ? 'Đang hoạt động' : 'Không hoạt động'}
                    {typing && ' • Đang nhập...'}
                  </p>
                </div>
              </div>

              <div ref={messageAreaRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    Bắt đầu cuộc trò chuyện với {selectedCandidate.name}
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'recruiter' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'recruiter'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p>{message.text}</p>
                        <div
                          className={`flex items-center justify-end gap-2 text-xs mt-1 ${
                            message.sender === 'recruiter' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          <span>{message.timestamp}</span>
                          {message.sender === 'recruiter' && (
                            <span className="text-xs">
                              {message.status === 'SENT' && 'Đã gửi'}
                              {message.status === 'DELIVERED' && 'Đã nhận'}
                              {message.status === 'READ' && 'Đã đọc'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!connected}
                />
                <button
                  type="submit"
                  disabled={!connected || !newMessage.trim()}
                  className={`text-white p-2 rounded-lg transition-colors ${
                    connected && newMessage.trim()
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                Vui lòng chọn ứng viên để bắt đầu trò chuyện
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterChatPage;