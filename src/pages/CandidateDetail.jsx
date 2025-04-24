// src/components/recruiter/CandidateDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBook, FaBriefcase, FaTags } from "react-icons/fa";
import { candidateService } from "../services/candidateService";
import Loading2 from "../components/Loading2";
import Sidebar from "../components/recruiter/Sidebar";

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidateDetail = async () => {
      try {
        setLoading(true);
        const response = await candidateService.getCandidateDetail(candidateId);
        setCandidate(response.result);
      } catch (error) {
        toast.error("Failed to load candidate details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateDetail();
  }, [candidateId, navigate]);

  const handleMessageCandidate = () => {
    // navigate(`/recruiter/chat/${candidateId}`);
    window.location.href = `/recruiter/chat/${candidateId}`;
  };

  if (loading) return <Loading2 />;

  if (!candidate) return <div className="text-center p-8">Candidate not found.</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Candidate Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
            {candidate.avatar && (
              <img
                src={candidate.avatar}
                alt="Candidate Avatar"
                className="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6"
              />
            )}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">{candidate.fullname}</h2>
              <p className="text-gray-600">{candidate.email}</p>
              {candidate.phone && (
                <p className="flex items-center text-gray-700 mt-2">
                  <FaPhone className="mr-2 text-gray-500" /> {candidate.phone}
                </p>
              )}
            </div>
          </div>

          {candidate.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Bio</h3>
              <p className="text-gray-700">{candidate.bio}</p>
            </div>
          )}

          {candidate.skills && candidate.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(candidate.skills).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.experiences && candidate.experiences.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Experiences</h3>
              {Array.from(candidate.experiences).map((exp, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="flex items-center text-gray-700">
                    <FaBriefcase className="mr-2 text-gray-500" />
                    <strong>{exp.position}</strong> at {exp.companyName}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {candidate.educations && candidate.educations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Educations</h3>
              {Array.from(candidate.educations).map((edu, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="flex items-center text-gray-700">
                    <FaBook className="mr-2 text-gray-500" />
                    <strong>{edu.degree}</strong> in {edu.major}
                  </p>
                  <p className="text-gray-600 mt-1">{edu.school}</p>
                  <p className="text-gray-600 mt-1">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                  {edu.gpa && (
                    <p className="text-gray-700 mt-1">GPA: {edu.gpa}</p>
                  )}
                  {edu.description && (
                    <p className="text-gray-700 mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleMessageCandidate}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <FaEnvelope className="mr-2" /> Message Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;