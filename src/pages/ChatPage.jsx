import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, Send, ChevronLeft } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import apiService from '../api/apiService';
import Header from '../components/Header';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const ChatPage = () => {
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
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
      console.log('Token gửi từ client:', token);
      const headers = {
        // Authorization: `Bearer ${token}`,
        // userId: user.userId,
        username: user.username,
      };
      stompClient.current.connect(headers, onConnected, onError);
    };

    const fetchRecruiters = async () => {
      try {
        //   const response = await apiService.get('/user/recruiters');
          const response = [
            {
                id: 6,
                name: 'Candidate 1',
            },
            {
                id: 7,
                name: 'Recruiter 2',
            }
          ]
          setRecruiters(response || []);
          setSelectedRecruiter(response[0]);
      } catch (error) {
        console.error('Error fetching recruiters:', error);
      }
    };

    fetchRecruiters();
    connectWebSocket();

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect();
        console.log('Disconnected from WebSocket');
      }
    };
  }, [isAuthenticated, user]);

  const onConnected = () => {
    setConnected(true);
    console.log('WebSocket connected with userId', user.userId);
    console.log('WebSocket connected with un', user.username);

    //subscribe để nhận tin nhắn private
    stompClient.current.subscribe(`/user/queue/messages`, function(message) {
       toast.success(message);
    });

    // recruiters.forEach(recruiter => subscribeToRecruiter(recruiter.id));
 
  };

  const subscribeToRecruiter = (recruiterId) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.subscribe(
        `/user/${user.userId}/queue/messages`,
        onMessageReceived
      );
    }
  };

  const onMessageReceived = (payload) => {
    const receivedMessage = JSON.parse(payload.body);

    if (receivedMessage.type === 'TYPING') {
      setTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTyping(false), 3000);
      return;
    }

    if (receivedMessage.type === 'CHAT' && selectedRecruiter && selectedRecruiter.userId === receivedMessage.recruiterId) {
      setMessages(prev => [
        ...prev,
        {
          id: receivedMessage.id || Date.now(), // Fallback nếu backend không trả id
          text: receivedMessage.content,
          sender: receivedMessage.sender.userId === user.userId ? 'user' : 'recruiter',
          timestamp: receivedMessage.timestamp || new Date().toLocaleTimeString(),
        },
      ]);

      stompClient.current.send(
        '/app/chat.markAsRead',
        { Authorization: `Bearer ${localStorage.getItem('authToken') || 'abc'}` },
        JSON.stringify({ messageId: receivedMessage.id })
      );
    }

    setRecruiters(prev =>
      prev.map(recruiter => {
        if (recruiter.userId === receivedMessage.recruiterId) {
          const isSelected = selectedRecruiter && selectedRecruiter.userId === recruiter.userId;
          return {
            ...recruiter,
            lastMessage: receivedMessage.content,
            unread: isSelected ? 0 : (recruiter.unread || 0) + 1,
          };
        }
        return recruiter;
      })
    );
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
    if (newMessage.trim() && selectedRecruiter && connected) {
      const chatMessage = {
        senderId: user.userId,
        recipientId: selectedRecruiter.id,
        content: newMessage,
        type: 'CHAT',
      };
      stompClient.current.send(
        '/app/chat.send',
        { },
        JSON.stringify(chatMessage)
      );
      setNewMessage('');
    }
  };

  const handleRecruiterSelect = async (recruiter) => {
    setSelectedRecruiter(recruiter);

    try {
    //   const response = await apiService.get(`/api/chat/history?userId=${recruiter.userId}`);
    //   const chatHistory = response.data || [];
    //   const formattedMessages = chatHistory.map(msg => ({
    //     id: msg.id,
    //     text: msg.content,
    //     sender: msg.sender.userId === user.userId ? 'user' : 'recruiter',
    //     timestamp: msg.timestamp || new Date().toLocaleTimeString(),
    //   }));
    //   setMessages(formattedMessages);

    //   setRecruiters(prev =>
    //     prev.map(r => (r.userId === recruiter.userId ? { ...r, unread: 0 } : r))
    //   );
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }

    // if (connected && !stompClient.current.subscriptions[`/user/${user.userId}/queue/messages`]) {
    //   subscribeToRecruiter(recruiter.userId);
    // }
  };

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    // if (selectedRecruiter && connected) {
    //   stompClient.current.send(
    //     `/app/chat.typing/${selectedRecruiter.userId}`,
    //     {},
    //     JSON.stringify({ userId: user.userId })
    //   );
    // }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-500" />
        Trò chuyện với Nhà tuyển dụng
        {!connected && <span className="text-sm text-red-500 ml-2">(Đang kết nối lại...)</span>}
      </h1>

      <div className="flex bg-white rounded-xl shadow-lg h-[calc(100vh-160px)]">
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Nhà tuyển dụng ({recruiters.length})</h2>
          {recruiters.map(recruiter => (
            <div
              key={recruiter.userId}
              onClick={() => handleRecruiterSelect(recruiter)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedRecruiter?.userId === recruiter.userId ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={recruiter.avatar || '/api/placeholder/40/40'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                {recruiter.active && (
                  <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{recruiter.name}</h3>
                <p className="text-sm text-gray-500 truncate">{recruiter.lastMessage}</p>
              </div>
              {recruiter.unread > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {recruiter.unread}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedRecruiter ? (
            <>
              <div className="p-4 border-b flex items-center">
                <button
                  className="md:hidden mr-2 text-gray-600"
                  onClick={() => setSelectedRecruiter(null)}
                >
                  <ChevronLeft />
                </button>
                <img
                  src={selectedRecruiter.avatar || '/api/placeholder/40/40'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{selectedRecruiter.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedRecruiter.active ? 'Đang hoạt động' : 'Không hoạt động'}
                    {typing && ' • Đang nhập...'}
                  </p>
                </div>
              </div>

              <div ref={messageAreaRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    Bắt đầu cuộc trò chuyện với {selectedRecruiter.name}
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp}
                        </p>
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
                Vui lòng chọn nhà tuyển dụng để bắt đầu trò chuyện
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;