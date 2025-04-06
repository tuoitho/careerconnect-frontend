import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Info, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';
import { chatbotService } from '../services/chatbotService';
import { useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: 'Xin chào! Tôi là trợ lý AI của CareerConnect. Tôi có thể giúp bạn tìm việc làm phù hợp, cung cấp lời khuyên về sự nghiệp, và trả lời các câu hỏi về quá trình ứng tuyển. Bạn cần hỗ trợ gì?',
      timestamp: new Date(),
      recommendations: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
      recommendations: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Call chatbot API
    try {
      const response = await chatbotService.sendMessage(inputValue);
      const botResponse = response.result;
      
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        recommendations: botResponse.hasRecommendations ? botResponse.jobRecommendations : []
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      toast.error('Không thể kết nối với chatbot. Vui lòng thử lại sau.');
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.',
        timestamp: new Date(),
        recommendations: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
    // Optionally close the chatbot after navigating
    // setIsOpen(false);
  };

  const handleFullPageView = () => {
    navigate('/candidate/chatbot');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chatbot button */}
      <button 
        onClick={toggleChatbot}
        className="bg-green-600 hover:bg-green-700 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        aria-label="Open AI assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <FaRobot className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chatbot panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-green-600 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FaRobot className="w-6 h-6 text-white" />
              <h3 className="text-white font-semibold">Trợ lý AI</h3>
            </div>
            <div className="flex items-center">
              <button 
                onClick={handleFullPageView}
                className="text-white hover:bg-green-700 rounded-full p-1 mr-2"
                title="Mở rộng"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleChatbot}
                className="text-white hover:bg-green-700 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                
                {/* Job recommendations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="mt-2 space-y-2 text-left">
                    {message.recommendations.map((job) => (
                      <div 
                        key={job.jobId}
                        className="bg-white p-3 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleJobClick(job.jobId)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-green-700">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <p className="text-xs text-gray-500">{job.location}</p>
                          </div>
                          <div className="bg-green-100 text-green-800 rounded-full px-2 py-1 text-xs font-semibold">
                            Xem ngay
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span>
                            {job.minSalary.toLocaleString('vi-VN')} - {job.maxSalary.toLocaleString('vi-VN')} VNĐ
                          </span>
                          <ChevronRight className="ml-auto w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập câu hỏi hoặc yêu cầu..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`px-4 py-2 rounded-r-lg ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
          
          {/* Disclaimer */}
          <div className="px-3 py-2 bg-gray-100 text-xs text-gray-500 rounded-b-lg flex items-start space-x-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Trợ lý AI có thể đưa ra thông tin không chính xác. Vui lòng xác minh các thông tin quan trọng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;