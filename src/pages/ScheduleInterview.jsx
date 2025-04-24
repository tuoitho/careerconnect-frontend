import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { interviewService } from '../services/interviewService';
import Loading2 from '../components/Loading2';

const ScheduleInterview = () => {
  const { applicationId, interviewId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isRescheduling = location.pathname.includes('reschedule');
  
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [interview, setInterview] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  console.log('applicationId', applicationId);
  // Get application details or interview details based on mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isRescheduling && interviewId) {
          // Fetch interview details for rescheduling
          const interviewResponse = await apiService.get(`/interview/${interviewId}`);
          setInterview(interviewResponse.result);
          
          // Fetch the related application
          const appResponse = await apiService.get(`/application/${interviewResponse.result.applicationId}`);
          setApplication(appResponse.result);
          
          // Pre-populate message field
          setMessage(`Rescheduled interview for job: ${appResponse.result?.job?.title}`);
        } else if (applicationId) {
          // Fetch application details for new scheduling
          const response = await apiService.get(`/application/${applicationId}`);
          setApplication(response.result);
        } else {
          setError('Missing required parameters');
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        setError('Không thể tải thông tin. Vui lòng thử lại sau.');
        toast.error('Không thể tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicationId, interviewId, isRescheduling]);

  // Pre-populate fields if rescheduling
  useEffect(() => {
    if (isRescheduling && interview) {
      // Extract date and time from interview.scheduledTime
      if (interview.scheduledTime) {
        const date = new Date(interview.scheduledTime);
        setSelectedDate(date.toISOString().split('T')[0]);
        
        // Format time as HH:MM
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setSelectedTime(`${hours}:${minutes}`);
      }
      
      // Pre-populate message if available
      if (interview.details) {
        setMessage(interview.details);
      }
    }
  }, [interview, isRescheduling]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Vui lòng chọn ngày và giờ');
      return;
    }
    
    // Combine date and time
    // const scheduledTimeISO = `${selectedDate}T${selectedTime}:00`;
    // offset UTC+7
    const scheduledTimeISO = new Date(`${selectedDate}T${selectedTime}:00+07:00`).toISOString();
    
    try {
      setIsSubmitting(true);
      
      if (isRescheduling && interviewId) {
        // For rescheduling
        const response = await interviewService.rescheduleInterview(interviewId, {
          applicationId: applicationId,
          scheduledTime: scheduledTimeISO,
          message: message
        });
        
        toast.success('Phỏng vấn đã được lên lịch lại thành công!');
        navigate('/recruiter/interviews');
      } else {
        // For new scheduling
        const response = await interviewService.scheduleInterview({
          applicationId: applicationId,
          scheduledTime: scheduledTimeISO,
          details: message
        });
        
        toast.success('Phỏng vấn đã được lên lịch thành công!');
        navigate('/recruiter/interviews');
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Có lỗi xảy ra khi lên lịch phỏng vấn');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading2 />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Không tìm thấy thông tin ứng viên.</p>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 text-white py-4 px-6">
          <h1 className="text-xl font-bold">
            {isRescheduling ? 'Lên lịch lại phỏng vấn' : 'Lên lịch phỏng vấn'}
          </h1>
        </div>
        
        <div className="p-6">
          <div className="mb-8 bg-blue-50 p-4 rounded-md border border-blue-100">
            <div className="flex items-start mb-4">
              <User className="mt-1 mr-3 text-blue-500" />
              <div>
                <h3 className="font-semibold">Ứng viên</h3>
                <p>{application.candidate?.fullName || 'Không có tên'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Info className="mt-1 mr-3 text-blue-500" />
              <div>
                <h3 className="font-semibold">Vị trí ứng tuyển</h3>
                <p>{application.job?.title || 'Không có thông tin'}</p>
              </div>
            </div>
          </div>
          
          {isRescheduling && (
            <div className="mb-8 bg-yellow-50 p-4 rounded-md border border-yellow-100">
              <div className="flex items-center">
                <Info className="mr-3 text-yellow-500" />
                <p className="text-yellow-700">
                  Bạn đang lên lịch lại cho cuộc phỏng vấn đã tồn tại. Thông báo sẽ được gửi đến ứng viên.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                <span className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Ngày phỏng vấn
                </span>
              </label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                <span className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Giờ phỏng vấn
                </span>
              </label>
              <input
                type="time"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                <span className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  Chi tiết phỏng vấn
                </span>
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập thông tin chi tiết về buổi phỏng vấn. Ví dụ: link Google Meet, câu hỏi chuẩn bị, v.v."
              />
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                onClick={() => navigate(-1)}
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Đang xử lý...</span>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {isRescheduling ? 'Lên lịch lại' : 'Lên lịch phỏng vấn'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterview;