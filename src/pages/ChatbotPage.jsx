import React, { useState, useRef, useEffect } from 'react';
import { Send, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { chatbotService } from '../services/chatbotService';
import { useNavigate } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';

const ChatbotPage = () => {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-green-600 p-4 flex items-center space-x-2">
          <FaRobot className="w-7 h-7 text-white" />
          <h1 className="text-xl font-semibold text-white">Trợ lý AI CareerConnect</h1>
        </div>
        
        <div className="h-[calc(100vh-320px)] overflow-y-auto p-6 bg-gray-50">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`mb-6 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div 
                className={`inline-block max-w-[80%] rounded-lg p-4 ${
                  message.sender === 'user' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
              </div>
              
              {/* Job recommendations */}
              {message.recommendations && message.recommendations.length > 0 && (
                <div className="mt-3 space-y-3 text-left">
                  <h3 className="text-gray-500 text-sm font-medium">Công việc phù hợp cho bạn:</h3>
                  {message.recommendations.map((job) => (
                    <div 
                      key={job.jobId}
                      className="bg-white p-4 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleJobClick(job.jobId)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-green-700 text-lg">{job.title}</h4>
                          <p className="text-gray-600">{job.company}</p>
                          <p className="text-gray-500 text-sm">{job.location}</p>
                        </div>
                        <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-semibold">
                          Xem ngay
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <p>
                          Lương: {job.minSalary.toLocaleString('vi-VN')} - {job.maxSalary.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                      
                      <div className="mt-2">
                        <button 
                          className="text-sm bg-green-50 hover:bg-green-100 text-green-700 py-1 px-3 rounded border border-green-200 transition-colors"
                        >
                          Xem chi tiết →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t border-gray-200 p-4">
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-700 flex items-start space-x-2">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <p>
              Hãy mô tả kỹ năng, kinh nghiệm hoặc vị trí mong muốn để nhận đề xuất công việc phù hợp.
              Bạn cũng có thể hỏi về các lời khuyên cho quá trình tìm việc, chuẩn bị phỏng vấn, hoặc xây dựng hồ sơ.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập câu hỏi hoặc yêu cầu..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`px-5 py-3 rounded-lg font-medium ${
                isLoading || !inputValue.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  <Send className="w-4 h-4 mr-1" />
                  Gửi
                </span>
              )}
            </button>
          </form>
          
          <p className="mt-3 text-xs text-gray-500 text-center">
            Trợ lý AI có thể đưa ra thông tin không chính xác. Vui lòng xác minh thông tin trước khi sử dụng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;