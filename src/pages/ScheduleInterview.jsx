import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  Info
} from 'lucide-react';
import apiService from '../services/apiService';
import Loading2 from '../components/Loading2';

const ScheduleInterview = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get application details
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const response = await apiService.get(`/application/${applicationId}`);
        setApplication(response.result);
      } catch (err) {
        console.error('Error fetching application details:', err);
        setError('Không thể tải thông tin ứng viên. Vui lòng thử lại sau.');
        toast.error('Không thể tải thông tin ứng viên');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Vui lòng chọn ngày và giờ phỏng vấn');
      return;
    }
    
    // Format date and time for API request
    const scheduledTime = new Date(`${selectedDate}T${selectedTime}`);
    
    // Validate date is in the future
    if (scheduledTime <= new Date()) {
      toast.error('Thời gian phỏng vấn phải là thời gian trong tương lai');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Schedule the interview
      const response = await apiService.post('/interview/schedule', {
        applicationId,
        scheduledTime: scheduledTime.toISOString(),
        message: message.trim() || 'Mời bạn tham gia buổi phỏng vấn trực tuyến.',
      });
      
      toast.success('Đã lên lịch phỏng vấn thành công');
      
      // Navigate to application details
      navigate(`/recruiter/application/${applicationId}`);
    } catch (err) {
      console.error('Error scheduling interview:', err);
      toast.error(err.message || 'Không thể lên lịch phỏng vấn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slots (30 minute intervals from 8:00 AM to 6:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 18 && minute === 30) continue; // Skip 6:30 PM
        
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (loading) return <Loading2 />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy đơn ứng tuyển</h1>
          <p className="text-gray-700">Đơn ứng tuyển không tồn tại hoặc đã bị xóa.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 flex items-center hover:underline"
          >
            &larr; Quay lại
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Video className="h-6 w-6" />
              Lên lịch phỏng vấn trực tuyến
            </h1>
            <p className="mt-2 opacity-90">
              Lên lịch phỏng vấn qua video với ứng viên. Ứng viên sẽ nhận được thông báo qua email.
            </p>
          </div>
          
          <div className="p-8">
            {/* Candidate and job info */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-100">
              <div className="flex items-start gap-4">
                {application.candidateAvatar ? (
                  <img 
                    src={application.candidateAvatar} 
                    alt={application.candidateName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                    <User className="h-8 w-8" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">{application.candidateName}</h2>
                  <p className="text-blue-600 font-medium">{application.jobTitle}</p>
                  <p className="text-gray-600 mt-1">Ứng tuyển vào: {new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8 text-yellow-800 flex gap-3">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Lưu ý về phỏng vấn trực tuyến:</p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                  <li>Đảm bảo bạn có kết nối internet ổn định</li>
                  <li>Kiểm tra camera và microphone trước buổi phỏng vấn</li>
                  <li>Chọn nơi yên tĩnh, ánh sáng tốt cho buổi phỏng vấn</li>
                  <li>Ứng viên sẽ được thông báo qua email</li>
                </ul>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Ngày phỏng vấn
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                {/* Time picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Thời gian (giờ Việt Nam)
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn thời gian</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Message to candidate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn cho ứng viên (tùy chọn)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập thông tin bổ sung cho ứng viên..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="pt-4 border-t flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Lên lịch phỏng vấn
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;