// JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCalendarAlt, FaChartLine, FaTag, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { jobService } from "../services/jobService";
import LoadingSpinner from "../components/LoadingSpinner";
import Sidebar from "../components/recruiter/Sidebar";

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await jobService.getPostedJobDetail(jobId);
        setJob(response.result);
      } catch (error) {
        toast.error("Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApplicationClick = (applicationId) => {
    navigate(`/recruiter/application/${applicationId}`);
  };

  if (loading) return <LoadingSpinner />;

  if (!job) return <div className="text-center p-8">Job not found.</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{job.title}</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="flex items-center text-gray-700">
                <FaBriefcase className="mr-2 text-gray-500" /> <strong>Type:</strong> {job.type}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <FaMapMarkerAlt className="mr-2 text-gray-500" /> <strong>Location:</strong> {job.location}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <FaMoneyBillWave className="mr-2 text-gray-500" /> <strong>Salary Range:</strong> {job.minSalary} - {job.maxSalary}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <FaCalendarAlt className="mr-2 text-gray-500" /> <strong>Deadline:</strong> {new Date(job.deadline).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="flex items-center text-gray-700">
                <FaChartLine className="mr-2 text-gray-500" /> <strong>Experience:</strong> {job.experience}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <FaTag className="mr-2 text-gray-500" /> <strong>Category:</strong> {job.category}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                <FaClock className="mr-2 text-gray-500" /> <strong>Created:</strong> {new Date(job.created).toLocaleString()}
              </p>
              <p className="flex items-center text-gray-700 mt-2">
                {job.active ? (
                  <FaToggleOn className="mr-2 text-green-500" />
                ) : (
                  <FaToggleOff className="mr-2 text-red-500" />
                )}
                <strong>Status:</strong> {job.active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>

          {/* Applications List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Applications</h3>
              <p className="text-gray-600">Total: {job.applications.length}</p>
            </div>
            {job.applications.length === 0 ? (
              <p className="text-gray-600">No applications yet.</p>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {job.applications.map((app) => (
                      <tr
                        key={app.applicationId}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleApplicationClick(app.applicationId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{app.applicationId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{app.candidateName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(app.appliedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {app.processed ? "Processed" : "Pending"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;