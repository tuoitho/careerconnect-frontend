import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Calendar, 
  Video, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import { interviewService } from '../services/interviewService';
import { selectCurrentUser } from '../store/slices/authSlice';
import Loading2 from '../components/Loading2';
import Sidebar from '../components/recruiter/Sidebar';
import Layout from '../components/Layout';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('upcoming'); // upcoming, past, all
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isRecruiter = currentUser?.role === 'RECRUITER';

  // Fetch interviews data
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const response = await interviewService.getInterviews();
        setInterviews(response.result || []);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('Failed to load interviews. Please try again later.');
        toast.error('Failed to load interviews');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Filter interviews based on status
  const filteredInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.scheduledTime);
    const now = new Date();
    
    if (filterStatus === 'upcoming') {
      return interviewDate > now && interview.status !== 'CANCELLED';
    } else if (filterStatus === 'past') {
      return interviewDate < now || interview.status === 'COMPLETED';
    } else {
      return true; // Show all
    }
  });

  // Sort interviews by scheduled time (newest first for past, earliest first for upcoming)
  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    const dateA = new Date(a.scheduledTime);
    const dateB = new Date(b.scheduledTime);
    return filterStatus === 'past' ? dateB - dateA : dateA - dateB;
  });

  // Handle join interview
  const handleJoinInterview = (interviewId) => {
    navigate(isRecruiter ? `/recruiter/interview/${interviewId}` : `/candidate/interview/${interviewId}`);
  };

  // Handle reschedule interview (recruiter only)
  const handleReschedule = (interviewId) => {
    navigate(`/recruiter/interview/reschedule/${interviewId}`);
  };

  // Handle cancel interview
  const handleCancelInterview = async (interviewId) => {
    if (window.confirm('Are you sure you want to cancel this interview?')) {
      try {
        await interviewService.cancelInterview(interviewId);
        toast.success('Interview cancelled successfully');
        
        // Update local state to reflect the cancellation
        setInterviews(prev => 
          prev.map(interview => 
            interview.id === interviewId 
              ? { ...interview, status: 'CANCELLED' } 
              : interview
          )
        );
      } catch (err) {
        console.error('Error cancelling interview:', err);
        toast.error('Failed to cancel interview. Please try again.');
      }
    }
  };

  // Get status badge color based on interview status
  const getStatusBadge = (interview) => {
    const interviewDate = new Date(interview.scheduledTime);
    const now = new Date();
    
    let color, text;
    
    switch(interview.status) {
      case 'SCHEDULED':
        color = interviewDate > now ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800';
        text = interviewDate > now ? 'Scheduled' : 'Missed';
        break;
      case 'STARTED':
        color = 'bg-green-100 text-green-800';
        text = 'In Progress';
        break;
      case 'COMPLETED':
        color = 'bg-gray-100 text-gray-800';
        text = 'Completed';
        break;
      case 'CANCELLED':
        color = 'bg-red-100 text-red-800';
        text = 'Cancelled';
        break;
      case 'RESCHEDULED':
        color = 'bg-yellow-100 text-yellow-800';
        text = 'Rescheduled';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
        text = interview.status;
    }
    
    return (
      <span className={`${color} px-2 py-1 rounded-full text-xs font-medium`}>
        {text}
      </span>
    );
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if interview is joinable (15 min before scheduled time until 30 min after)
  const isInterviewJoinable = (interview) => {
    if (interview.status === 'CANCELLED') return false;
    
    const scheduledTime = new Date(interview.scheduledTime);
    const now = new Date();
    
    // Can join 15 minutes before scheduled time
    const earliestJoinTime = new Date(scheduledTime);
    earliestJoinTime.setMinutes(earliestJoinTime.getMinutes() - 15);
    
    // Can join up to 30 minutes after scheduled time
    const latestJoinTime = new Date(scheduledTime);
    latestJoinTime.setMinutes(latestJoinTime.getMinutes() + 30);
    
    return now >= earliestJoinTime && now <= latestJoinTime;
  };

  // Get relative time description (e.g. "Starts in 10 minutes", "Started 5 minutes ago")
  const getRelativeTimeDescription = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins > 0) {
      if (diffMins < 60) {
        return `Starts in ${diffMins} minute${diffMins === 1 ? '' : 's'}`;
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `Starts in ${hours} hour${hours === 1 ? '' : 's'}`;
      } else {
        const days = Math.floor(diffMins / 1440);
        return `Starts in ${days} day${days === 1 ? '' : 's'}`;
      }
    } else {
      const absDiffMins = Math.abs(diffMins);
      if (absDiffMins < 60) {
        return `Started ${absDiffMins} minute${absDiffMins === 1 ? '' : 's'} ago`;
      } else if (absDiffMins < 1440) {
        const hours = Math.floor(absDiffMins / 60);
        return `Started ${hours} hour${hours === 1 ? '' : 's'} ago`;
      } else {
        const days = Math.floor(absDiffMins / 1440);
        return `Started ${days} day${days === 1 ? '' : 's'} ago`;
      }
    }
  };

  // Wrapper component for layout based on user role
  const PageWrapper = ({ children }) => {
    return isRecruiter ? (
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    ) : (
      <Layout>
        <div className="container mx-auto p-8">
          {children}
        </div>
      </Layout>
    );
  };

  if (loading) {
    return (
      <PageWrapper>
        <Loading2 />
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Video className="h-8 w-8 text-blue-600" />
        Interview Management
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-600 font-medium mr-4">Filter:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatus('upcoming')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterStatus('past')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {sortedInterviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No interviews found</h2>
          <p className="text-gray-500">
            {filterStatus === 'upcoming'
              ? "You don't have any upcoming interviews scheduled."
              : filterStatus === 'past'
              ? "You don't have any past interviews."
              : "You don't have any interviews."}
          </p>
          
          {isRecruiter && (
            <p className="mt-4 text-gray-600">
              Schedule an interview with a candidate by visiting their application details.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Interview cards */}
          {sortedInterviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
            >
              {/* Interview card header */}
              <div className="bg-blue-50 p-4 flex justify-between items-center border-b border-blue-100">
                <div className="flex items-center">
                  <div className="bg-blue-600 p-2 rounded-lg mr-3">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{interview.jobTitle}</h3>
                    <p className="text-sm text-gray-600">
                      {isRecruiter
                        ? `Interview with ${interview.candidateName}`
                        : `Interview with ${interview.recruiterName || 'Recruiter'}`}
                    </p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(interview)}
                </div>
              </div>

              {/* Interview card body */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-start mb-3">
                      <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-gray-700 font-medium">
                          {formatDateTime(interview.scheduledTime)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getRelativeTimeDescription(interview.scheduledTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                      <div>
                        <p className="text-gray-700">
                          {isRecruiter ? interview.candidateName : interview.recruiterName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isRecruiter ? 'Candidate' : 'Recruiter'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    {interview.message && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700">
                        <p className="font-medium mb-1">Message:</p>
                        <p>{interview.message}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-4 justify-end">
                      {isInterviewJoinable(interview) && (
                        <button
                          onClick={() => handleJoinInterview(interview.id)}
                          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Interview
                        </button>
                      )}

                      {isRecruiter && interview.status !== 'COMPLETED' && interview.status !== 'CANCELLED' && (
                        <>
                          <button
                            onClick={() => handleReschedule(interview.id)}
                            className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Reschedule
                          </button>

                          <button
                            onClick={() => handleCancelInterview(interview.id)}
                            className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default InterviewsPage;