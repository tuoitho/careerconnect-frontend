// src/components/recruiter/ApplicationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import { jobService } from "../services/jobService";
import Loading2 from "../components/Loading2";
import Sidebar from "../components/recruiter/Sidebar";

const ApplicationDetail = () => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);
        const response = await jobService.getApplicationDetail(applicationId); // New service method
        setApplication(response.result);
      } catch (error) {
        toast.error("Failed to load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [applicationId, navigate]);

  const handleViewProfile = () => {
    navigate(`/candidate/${application.candidateId}`);
  };

  const handleMessageCandidate = () => {
    navigate(`/recruiter/chat/${application.candidateId}`);
  };

  if (loading) return <Loading2 />;

  if (!application) return <div className="text-center p-8">Application not found.</div>;

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

          <button
            onClick={handleMessageCandidate}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaEnvelope className="mr-2" /> Message Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;