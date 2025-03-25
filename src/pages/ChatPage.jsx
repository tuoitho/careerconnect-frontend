import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, ChevronLeft } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice';

const ChatPage = () => {
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const selectedRecruiterRef = useRef(null);
  const [recruiterMessages, setRecruiterMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [connected, setConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const stompClient = useRef(null);
  const messageAreaRef = useRef(null);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    selectedRecruiterRef.current = selectedRecruiter;
  }, [selectedRecruiter]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const connectWebSocket = () => {
      // const socket = new SockJS('http://localhost:8088/ws-chat');
      // lấy từ env vite
      const socket = new SockJS(import.meta.env.VITE_BACKEND_URL + '/ws-chat');
      stompClient.current = Stomp.over(socket);
      const token = localStorage.getItem('authToken') || 'abc';
      const headers = { Authorization: `Bearer ${token}` };
      stompClient.current.connect(headers, onConnected, onError);
    };

    connectWebSocket();
  }, [isAuthenticated, user]);

  const onConnected = () => {
    setConnected(true);
    stompClient.current.subscribe(`/user/queue/messages`, onMessageReceived);
    stompClient.current.subscribe('/topic/chat.messageSaved', onMessageSaved);
    stompClient.current.subscribe('/topic/userStatus', onUserStatusReceived);
    fetchRecruiters();
  };

  const onUserStatusReceived = (payload) => {
    const statusMessage = JSON.parse(payload.body);
    const { userId, online } = statusMessage;
    console.log(`User ${userId} is now ${online ? 'online' : 'offline'}`);

    setRecruiters(prev =>
      prev.map(rec =>
        rec.id === userId ? { ...rec, active: online } : rec
      )
    );

    setSelectedRecruiter(prev =>
      prev && prev.id === userId ? { ...prev, active: online } : prev
    );
  };

  const fetchRecruiters = async () => {
    try {
      const response = await apiService.get('/chat/recruiter-contacts');
      const recruiters = response.result || [];
      setRecruiters(recruiters.map(rec => ({
        ...rec,
        active: rec.active || false,
      })));

      const allMessages = {};
      const unreadCounts = {};
      for (const recruiter of recruiters) {
        const response = await apiService.get(`/chat/history?userId2=${recruiter.id}`);
        const chatHistory = response.result || [];
        const formattedMessages = chatHistory.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.senderId === user.userId ? 'user' : 'recruiter',
          timestamp: msg.timestamp || new Date().toLocaleTimeString(),
          status: msg.status,
        }));
        allMessages[recruiter.id] = formattedMessages;
        unreadCounts[recruiter.id] = chatHistory.filter(
          msg => msg.status !== 'READ' && msg.senderId !== user.userId
        ).length;
      }
      setRecruiterMessages(allMessages);
      setRecruiters(prev =>
        prev.map(rec => ({
          ...rec,
          unread: unreadCounts[rec.id] || 0,
        }))
      );
      setMessages(allMessages[recruiters[0]?.id] || []);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
    }
  };

  const onMessageReceived = (payload) => {
    const receivedMessage = JSON.parse(payload.body);
    const senderId = receivedMessage.senderId;
    const messageData = {
      id: receivedMessage.tempId || Date.now(),
      text: receivedMessage.content,
      sender: senderId === user.userId ? 'user' : 'recruiter',
      timestamp: receivedMessage.timestamp || new Date().toLocaleTimeString(),
      status: receivedMessage.status || 'SENT',
    };

    setRecruiterMessages(prev => ({
      ...prev,
      [senderId]: [...(prev[senderId] || []), messageData],
    }));

    if (selectedRecruiterRef.current && selectedRecruiterRef.current.id === senderId) {
      setMessages(prev => [...prev, messageData]);
      if (senderId !== user.userId) {
        stompClient.current.send(
          '/app/chat.markAsRead',
          {},
          JSON.stringify({ messageId: messageData.id })
        );
      }
    } else {
      setRecruiters(prev =>
        prev.map(rec =>
          rec.id === senderId ? { ...rec, unread: (rec.unread || 0) + 1 } : rec
        )
      );
    }
  };

  const onMessageSaved = (payload) => {
    const savedMessage = JSON.parse(payload.body);
    const { id, tempId, senderId, content, status } = savedMessage;
    const messageData = {
      id,
      text: content,
      sender: senderId === user.userId ? 'user' : 'recruiter',
      timestamp: new Date().toLocaleTimeString(),
      status: status || 'SENT',
    };

    // Cập nhật recruiterMessages: thay thế tin nhắn tạm thời bằng tin nhắn chính thức
    setRecruiterMessages(prev => ({
      ...prev,
      [senderId]: (prev[senderId] || []).map(msg =>
        msg.id === tempId ? messageData : msg
      ).concat((prev[senderId] || []).some(msg => msg.id === tempId) ? [] : [messageData]),
    }));

    // Cập nhật messages nếu đang xem recruiter đó
    if (selectedRecruiterRef.current && selectedRecruiterRef.current.id === senderId) {
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? messageData : msg))
          .concat(prev.some(msg => msg.id === tempId) ? [] : [messageData])
      );
      if (senderId !== user.userId) {
        stompClient.current.send(
          '/app/chat.markAsRead',
          {},
          JSON.stringify({ messageId: id })
        );
      }
    }
    // toast.success(`Tin nhắn mới từ ${senderId}: ${content}`);
  };

  const onError = (error) => {
    console.error('WebSocket error:', error);
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
        tempId: Date.now(),
        senderId: user.userId,
        recipientId: selectedRecruiter.id,
        content: newMessage,
        type: 'CHAT',
      };
      stompClient.current.send(
        '/app/chat.send',
        { Authorization: `Bearer ${localStorage.getItem('authToken') || 'abc'}` },
        JSON.stringify(chatMessage)
      );

      // Thêm tin nhắn tạm thời vào giao diện ngay lập tức
      const tempMessage = {
        id: chatMessage.tempId,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        status: 'SENT',
      };
      setMessages(prev => [...prev, tempMessage]);
      setRecruiterMessages(prev => ({
        ...prev,
        [selectedRecruiter.id]: [...(prev[selectedRecruiter.id] || []), tempMessage],
      }));
      setNewMessage('');
    }
  };

  const handleRecruiterSelect = async (recruiter) => {
    setSelectedRecruiter(recruiter);
    try {
      const response = await apiService.get(`/chat/history?userId2=${recruiter.id}`);
      const chatHistory = response.result || [];
      const formattedMessages = chatHistory.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.senderId === user.userId ? 'user' : 'recruiter',
        timestamp: msg.timestamp || new Date().toLocaleTimeString(),
        status: msg.status,
      }));
      setMessages(formattedMessages);
      setRecruiterMessages(prev => ({
        ...prev,
        [recruiter.id]: formattedMessages,
      }));

      const unreadMessages = chatHistory.filter(
        msg => msg.status !== 'READ' && msg.senderId !== user.userId
      );
      unreadMessages.forEach(msg => {
        stompClient.current.send(
          '/app/chat.markAsRead',
          {},
          JSON.stringify({ messageId: msg.id })
        );
      });
      setRecruiters(prev =>
        prev.map(r => (r.id === recruiter.id ? { ...r, unread: 0 } : r))
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
              key={recruiter.id}
              onClick={() => handleRecruiterSelect(recruiter)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedRecruiter?.id === recruiter.id ? 'bg-blue-50 border border-blue-200' : ''
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
                <h3 className="font-medium">{recruiter.fullname}</h3>
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
                        <div
                          className={`flex items-center justify-end gap-2 text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          <span>{message.timestamp}</span>
                          {message.sender === 'user' && (
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
                  onChange={e => setNewMessage(e.target.value)}
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