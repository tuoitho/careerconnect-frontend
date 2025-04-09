import React, { useState, useEffect, useRef } from 'react'; // Removed useContext and duplicate React import
import { useSelector } from 'react-redux'; // Added useSelector
import { MessageSquare, Send, ChevronLeft } from 'lucide-react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import apiService from '../services/apiService.js';
import { toast } from 'react-toastify';
// import AuthContext from '../context/AuthContext'; // Removed AuthContext
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice'; // Import Redux selectors
import Loading2 from '../components/Loading2'; // Import Loading2 component
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
  // const { user, isAuthenticated } = useContext(AuthContext); // Removed context usage
  const isAuthenticated = useSelector(selectIsAuthenticated); // Get auth state from Redux
  const currentUser = useSelector(selectCurrentUser); // Get user from Redux
  const [loading, setLoading] = useState(true); // Loading state for initial fetch
  useEffect(() => {
    selectedRecruiterRef.current = selectedRecruiter;
  }, [selectedRecruiter]);

  useEffect(() => {
    // Use isAuthenticated and currentUser from Redux
    if (!isAuthenticated || !currentUser) return;

    const connectWebSocket = () => {
      const socket = new SockJS(import.meta.env.VITE_BACKEND_URL + '/ws-chat');
      stompClient.current = Stomp.over(socket);
      const token = localStorage.getItem('access_token') || 'abc'; // Consider getting token from Redux state if stored there
      const headers = { Authorization: `Bearer ${token}` };
      stompClient.current.connect(headers, onConnected, onError);
    };

    connectWebSocket();

    // Cleanup function to disconnect WebSocket on component unmount
    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {
          console.log('WebSocket Disconnected');
        });
      }
    };
    // Dependency is now currentUser as well
  }, [isAuthenticated, currentUser]);

  const onConnected = () => {
    setConnected(true);
    console.log('WebSocket Connected');
    stompClient.current.subscribe(`/user/queue/messages`, onMessageReceived);
    stompClient.current.subscribe('/topic/chat.messageSaved', onMessageSaved);
    stompClient.current.subscribe('/topic/userStatus', onUserStatusReceived);
    fetchRecruiters();
  };

  const onUserStatusReceived = (payload) => {
    try {
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
    } catch (error) {
      console.error("Error processing user status:", error);
    }
  };

  const fetchRecruiters = async () => {
    if (!currentUser?.userId) return; // Ensure currentUser is available

    try {
      const response = await apiService.get('/chat/recruiter-contacts');
      const fetchedRecruiters = response.result || [];
      setRecruiters(fetchedRecruiters.map(rec => ({
        ...rec,
        active: rec.active || false, // Ensure active property exists
      })));

      const allMessages = {};
      const unreadCounts = {};
      for (const recruiter of fetchedRecruiters) {
        try {
          const historyResponse = await apiService.get(`/chat/history?userId2=${recruiter.id}`);
          const chatHistory = historyResponse.result || [];
          const formattedMessages = chatHistory.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.senderId === currentUser.userId ? 'user' : 'recruiter',
            timestamp: msg.timestamp || new Date().toLocaleTimeString(), // Fallback timestamp
            status: msg.status,
          }));
          allMessages[recruiter.id] = formattedMessages;
          // Calculate unread counts based on currentUser.userId
          unreadCounts[recruiter.id] = chatHistory.filter(
            msg => msg.status !== 'READ' && msg.senderId !== currentUser.userId
          ).length;
        } catch (historyError) {
          console.error(`Error fetching history for recruiter ${recruiter.id}:`, historyError);
          allMessages[recruiter.id] = []; // Set empty history on error
          unreadCounts[recruiter.id] = 0;
        }
      }
      setRecruiterMessages(allMessages);
      setRecruiters(prev =>
        prev.map(rec => ({
          ...rec,
          unread: unreadCounts[rec.id] || 0,
        }))
      );

      // Set initial messages for the first recruiter if available
      if (fetchedRecruiters.length > 0) {
        const firstRecruiter = fetchedRecruiters[0];
        setMessages(allMessages[firstRecruiter.id] || []);
        setSelectedRecruiter(firstRecruiter); // Select the first one by default
      } else {
        setMessages([]); // No recruiters, no messages
      }
    } catch (error) {
      console.error('Error fetching recruiters:', error);
      toast.error("Failed to load recruiter contacts.");
    }
    setLoading(false); // Set loading to false after fetching
  };

  const onMessageReceived = (payload) => {
    if (!currentUser?.userId) return;
    try {
      const receivedMessage = JSON.parse(payload.body);
      const senderId = receivedMessage.senderId;
      const messageData = {
        id: receivedMessage.tempId || receivedMessage.id || Date.now(), // Use real ID if available
        text: receivedMessage.content,
        sender: senderId === currentUser.userId ? 'user' : 'recruiter',
        timestamp: receivedMessage.timestamp || new Date().toLocaleTimeString(),
        status: receivedMessage.status || 'DELIVERED', // Assume delivered if received
      };

      setRecruiterMessages(prev => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), messageData],
      }));

      if (selectedRecruiterRef.current && selectedRecruiterRef.current.id === senderId) {
        setMessages(prev => [...prev, messageData]);
        // Mark as read if the sender is not the current user
        if (senderId !== currentUser.userId && stompClient.current && stompClient.current.connected) {
          stompClient.current.send(
            '/app/chat.markAsRead',
            {},
            JSON.stringify({ messageId: messageData.id })
          );
        }
      } else {
        // Increment unread count for the specific recruiter
        setRecruiters(prev =>
          prev.map(rec =>
            rec.id === senderId ? { ...rec, unread: (rec.unread || 0) + 1 } : rec
          )
        );
        toast.info(`New message from ${receivedMessage.senderName || 'Recruiter'}`); // Optional notification
      }
    } catch (error) {
      console.error("Error processing received message:", error);
    }
  };

  const onMessageSaved = (payload) => {
     if (!currentUser?.userId) return;
    try {
      const savedMessage = JSON.parse(payload.body);
      const { id, tempId, senderId, recipientId, content, status } = savedMessage;

      // Determine the other user's ID (either sender or recipient)
      const otherUserId = senderId === currentUser.userId ? recipientId : senderId;

      const messageData = {
        id, // Use the final ID from the backend
        text: content,
        sender: senderId === currentUser.userId ? 'user' : 'recruiter',
        timestamp: savedMessage.timestamp || new Date().toLocaleTimeString(), // Use backend timestamp if available
        status: status || 'SENT', // Use backend status
      };

      // Update recruiterMessages: replace temp message or add if not present
      setRecruiterMessages(prev => {
        const currentMessages = prev[otherUserId] || [];
        const messageExists = currentMessages.some(msg => msg.id === id); // Check by final ID
        const tempMessageIndex = currentMessages.findIndex(msg => msg.id === tempId);

        if (messageExists) return prev; // Already have the final message

        if (tempMessageIndex !== -1) {
          // Replace temp message
          const updatedMessages = [...currentMessages];
          updatedMessages[tempMessageIndex] = messageData;
          return { ...prev, [otherUserId]: updatedMessages };
        } else {
          // Add new message if temp wasn't found (edge case)
          return { ...prev, [otherUserId]: [...currentMessages, messageData] };
        }
      });

      // Update messages if viewing the relevant chat
      if (selectedRecruiterRef.current && selectedRecruiterRef.current.id === otherUserId) {
        setMessages(prev => {
           const messageExists = prev.some(msg => msg.id === id);
           const tempMessageIndex = prev.findIndex(msg => msg.id === tempId);

           if (messageExists) return prev;

           if (tempMessageIndex !== -1) {
             const updatedMessages = [...prev];
             updatedMessages[tempMessageIndex] = messageData;
             return updatedMessages;
           } else {
             return [...prev, messageData];
           }
        });
         // Mark as read if the message was from the other user
        if (senderId !== currentUser.userId && stompClient.current && stompClient.current.connected) {
           stompClient.current.send(
             '/app/chat.markAsRead',
             {},
             JSON.stringify({ messageId: id })
           );
         }
      }
    } catch (error) {
      console.error("Error processing saved message:", error);
    }
  };

  const onError = (error) => {
    console.error('WebSocket error:', error);
    toast.error("Chat connection error. Attempting to reconnect...");
    setConnected(false);
    // Implement more robust reconnection logic if needed
    setTimeout(() => {
      if (!stompClient.current?.connected && isAuthenticated && currentUser) {
        console.log("Attempting to reconnect WebSocket...");
        connectWebSocket();
      }
    }, 5000); // Reconnect after 5 seconds
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedRecruiter && connected && currentUser?.userId) {
      const tempId = `temp_${Date.now()}`; // Unique temporary ID
      const chatMessage = {
        tempId: tempId,
        senderId: currentUser.userId,
        recipientId: selectedRecruiter.id,
        content: newMessage,
        type: 'CHAT',
      };

      // Optimistically add message to UI
      const tempMessage = {
        id: tempId, // Use temporary ID
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString(),
        status: 'PENDING', // Indicate pending state
      };
      setMessages(prev => [...prev, tempMessage]);
      setRecruiterMessages(prev => ({
        ...prev,
        [selectedRecruiter.id]: [...(prev[selectedRecruiter.id] || []), tempMessage],
      }));

      // Send message via WebSocket
      stompClient.current.send(
        '/app/chat.send',
        { },
        JSON.stringify(chatMessage)
      );

      setNewMessage(''); // Clear input field
    } else if (!connected) {
        toast.warn("Not connected to chat server.");
    } else if (!newMessage.trim()) {
        toast.warn("Message cannot be empty.");
    }
  };

  const handleRecruiterSelect = async (recruiter) => {
    if (!currentUser?.userId) return;
    setSelectedRecruiter(recruiter);
    setMessages(recruiterMessages[recruiter.id] || []); // Show cached messages immediately

    // Mark messages as read optimistically in UI and send request
    const unreadMessagesToMark = (recruiterMessages[recruiter.id] || []).filter(
      msg => msg.status !== 'READ' && msg.senderId !== currentUser.userId
    );

    if (unreadMessagesToMark.length > 0) {
       // Update UI immediately
       setRecruiters(prev =>
         prev.map(r => (r.id === recruiter.id ? { ...r, unread: 0 } : r))
       );
       setRecruiterMessages(prev => ({
           ...prev,
           [recruiter.id]: (prev[recruiter.id] || []).map(msg =>
               unreadMessagesToMark.some(unread => unread.id === msg.id) ? { ...msg, status: 'READ' } : msg
           )
       }));
       setMessages(prev => prev.map(msg =>
            unreadMessagesToMark.some(unread => unread.id === msg.id) ? { ...msg, status: 'READ' } : msg
       ));


      // Send mark as read requests
      unreadMessagesToMark.forEach(msg => {
        if (stompClient.current && stompClient.current.connected) {
          stompClient.current.send(
            '/app/chat.markAsRead',
            {},
            JSON.stringify({ messageId: msg.id })
          );
        }
      });
    }

    // Optionally re-fetch history to ensure consistency, though optimistic updates might suffice
    // try {
    //   const response = await apiService.get(`/chat/history?userId2=${recruiter.id}`);
    //   // ... process and update state if needed ...
    // } catch (error) {
    //   console.error('Error re-fetching chat history:', error);
    // }
  };

  // Scroll to bottom effect
  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 h-screen">
      {loading && <Loading2/>}
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-500" />
        Trò chuyện với Nhà tuyển dụng
        {!connected && <span className="text-sm text-red-500 ml-2">(Connecting...)</span>}
      </h1>

      <div className="flex bg-white rounded-xl shadow-lg h-[calc(100vh-160px)]">
        {/* Recruiter List */}
        <div className="w-full md:w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Nhà tuyển dụng ({recruiters.length})</h2>
          {recruiters.length === 0 && <p className="text-gray-500">No contacts found.</p>}
          {recruiters.map(recruiter => (
            <div
              key={recruiter.id}
              onClick={() => handleRecruiterSelect(recruiter)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedRecruiter?.id === recruiter.id ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={recruiter.avatar || '/api/placeholder/40/40'} // Fallback avatar
                  alt={`${recruiter.fullname}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                  onError={(e) => e.target.src = '/api/placeholder/40/40'} // Handle image load error
                />
                {recruiter.active && (
                  <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" title="Online"></span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-medium truncate">{recruiter.fullname || 'Recruiter'}</h3>
                {/* Optionally show last message preview */}
                {/* <p className="text-sm text-gray-500 truncate">{recruiter.lastMessage}</p> */}
              </div>
              {recruiter.unread > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full ml-2">
                  {recruiter.unread}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedRecruiter ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center">
                {/* Back button for mobile? */}
                <img
                  src={selectedRecruiter.avatar || '/api/placeholder/40/40'}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-3"
                  onError={(e) => e.target.src = '/api/placeholder/40/40'}
                />
                <div>
                  <h3 className="font-semibold">{selectedRecruiter.fullname || 'Recruiter'}</h3>
                  <p className={`text-sm ${selectedRecruiter.active ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedRecruiter.active ? 'Online' : 'Offline'}
                    {/* {typing && ' • Typing...'} */}
                  </p>
                </div>
              </div>

              {/* Message List */}
              <div ref={messageAreaRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    Start the conversation with {selectedRecruiter.fullname || 'this recruiter'}.
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id} // Use final ID if available, else tempId
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div
                          className={`flex items-center justify-end gap-2 text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100 opacity-80' : 'text-gray-400'
                          }`}
                        >
                          <span>{message.timestamp}</span>
                          {message.sender === 'user' && (
                            <span className="text-xs" title={message.status}>
                              {message.status === 'PENDING' && 'Sending...'}
                              {message.status === 'SENT' && 'Sent'}
                              {message.status === 'DELIVERED' && 'Delivered'}
                              {message.status === 'READ' && 'Read'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2 bg-white">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  disabled={!connected}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!connected || !newMessage.trim()}
                  className={`text-white p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
                    connected && newMessage.trim()
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  title="Send Message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            // Placeholder when no recruiter is selected
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                Select a recruiter to start chatting
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
