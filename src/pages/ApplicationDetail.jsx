// src/components/recruiter/ApplicationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaFileAlt, FaCalendarAlt, FaVideo } from "react-icons/fa";
import { jobService } from "../services/jobService";
import Loading2 from "../components/Loading2";
import Sidebar from "../components/recruiter/Sidebar";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);
        const response = await jobService.getApplicationDetail(applicationId);
        setApplication(response.result);
        
        // Fetch interviews for this application
        const interviewsResponse = await jobService.getApplicationInterviews(applicationId);
        setInterviews(interviewsResponse.result || []);
      } catch (error) {
        toast.error("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [applicationId, navigate]);

  const handleViewProfile = () => {
    // navigate(`/candidate/${application.candidateId}`);
    window.open(`/recruiter/candidate/${application.candidateId}`, "_blank");
  };

  const handleMessageCandidate = () => {
    // navigate(`/recruiter/chat/${application.candidateId}`);
    // open in new tab
    window.open(`/recruiter/chat/${application.candidateId}`, "_blank");
  };

  const handleScheduleInterview = () => {
    navigate(`/recruiter/interview/schedule/${applicationId}`);
  };

  // Check if there's an upcoming interview that can be joined
  const getUpcomingInterview = () => {
    const now = new Date();
    
    // Sort interviews by scheduled time (most recent first)
    const sortedInterviews = [...interviews].sort((a, b) => 
      new Date(b.scheduledTime) - new Date(a.scheduledTime)
    );
    
    // Find the first interview that is scheduled or in progress
    return sortedInterviews.find(interview => {
      const interviewTime = new Date(interview.scheduledTime);
      const isUpcoming = interviewTime > now;
      const canJoin = interview.status === 'SCHEDULED' || interview.status === 'STARTED';
      return isUpcoming && canJoin;
    });
  };

  const handleJoinInterview = (interviewId) => {
    navigate(`/recruiter/interview/${interviewId}`);
  };

  if (loading) return <Loading2 />;

  if (!application) return <div className="text-center p-8">Application not found.</div>;

  const upcomingInterview = getUpcomingInterview();

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Application Details</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="flex items-center text-gray-700">
                <FaUser className="mr-2 text-gray-500" />
                <strong>Job:</strong> {application.jobTitle}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleString()}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <strong>Status:</strong> {application.processed ? "Processed" : "Pending"}
              </p>
            </div>
            <div>
              <p className="flex items-center text-gray-700">
                <FaUser className="mr-2 text-gray-500" />
                <strong>Candidate:</strong>
                <span
                  className="ml-2 text-blue-600 cursor-pointer hover:underline"
                  onClick={handleViewProfile}
                >
                  {application.candidateName}
                </span>
              </p>
              {application.candidateAvatar && (
                <img
                  src={application.candidateAvatar}
                  alt="Candidate Avatar"
                  className="w-16 h-16 rounded-full mt-2"
                />
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Cover Letter</h3>
            <p className="text-gray-700">{application.coverLetter || "No cover letter provided."}</p>
          </div>

          {application.cvPath && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">CV</h3>
              <a
                href={application.cvPath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:underline"
              >
                <FaFileAlt className="mr-2" /> View CV
              </a>
            </div>
          )}

          {/* Interview section */}
          <div className="mb-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Interview</h3>
            
            {upcomingInterview ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Upcoming Interview</h4>
                    <p className="text-gray-700 mt-1">
                      <FaCalendarAlt className="inline mr-2 text-gray-500" />
                      Scheduled for: {new Date(upcomingInterview.scheduledTime).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <strong>Status:</strong> {upcomingInterview.status}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleJoinInterview(upcomingInterview.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <FaVideo className="mr-2" /> Join Interview
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-700">
                No scheduled interviews. 
                <button
                  onClick={handleScheduleInterview}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Schedule an interview
                </button>
              </div>
            )}
            
            {interviews.length > 0 && (
              <div className="mt-4">
                <a 
                  href="/recruiter/interviews" 
                  target="_blank" 
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <FaVideo className="mr-2" /> View all interviews ({interviews.length})
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleMessageCandidate}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <FaEnvelope className="mr-2" /> Message Candidate
            </button>
            
            {!upcomingInterview && (
              <button
                onClick={handleScheduleInterview}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FaVideo className="mr-2" /> Schedule Interview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;