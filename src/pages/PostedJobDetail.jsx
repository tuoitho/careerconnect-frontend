import { useEffect } from 'react';
import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiDollarSign, FiCalendar, FiUsers, FiCheck, FiClock } from 'react-icons/fi';
import { jobService } from '../services/jobService';
import { useParams } from 'react-router-dom';

function PostedJobDetail() {
  // Normally this would come from an API, using mock data for now
  const [jobDetail, setJobDetail] = useState({
    jobId: 1,
    title: "Senior React Developer",
    description: "We are looking for an experienced React developer to join our team...",
    location: "San Francisco, CA",
    type: "FULL_TIME",
    minSalary: "120000",
    maxSalary: "150000",
    created: "2024-02-15T09:00:00",
    updated: "2024-02-15T09:00:00",
    deadline: "2024-03-15T00:00:00",
    experience: "SENIOR",
    category: "Software Development",
    active: true,
    applications: [
      {
        applicationId: 1,
        candidateName: "John Doe",
        appliedAt: "2024-02-16T10:30:00",
        processed: false
      },
      {
        applicationId: 2,
        candidateName: "Jane Smith",
        appliedAt: "2024-02-16T11:45:00",
        processed: true
      }
    ]
  });
  const { jobId } = useParams();

  const fetchJobDetail = async () => {
    try {
      const response = await jobService.getPostedJobDetail(jobId);
      setJobDetail(response.result);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    // This would fetch the job details from the API
    fetchJobDetail();
  }, []);

  const handleMarkProcessed = (applicationId) => {
    setJobDetail(prev => ({
      ...prev,
      applications: prev.applications.map(app => 
        app.applicationId === applicationId 
          ? { ...app, processed: !app.processed }
          : app
      )
    }));
  };

  const handleViewApplication = (applicationId) => {
    // This would navigate to the application detail page
    window.location.href = `/applications/${applicationId}`;
  };

  const formatSalary = (min, max) => {
    const formatNumber = (num) => 
      new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }).format(num);
    
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Job Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{jobDetail.title}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="h-5 w-5 mr-2" />
                  <span>{jobDetail.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiBriefcase className="h-5 w-5 mr-2" />
                  <span>{jobDetail.type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiDollarSign className="h-5 w-5 mr-2" />
                  <span>{formatSalary(jobDetail.minSalary, jobDetail.maxSalary)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="h-5 w-5 mr-2" />
                  <span>Deadline: {formatDate(jobDetail.deadline)}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600 mb-4">{jobDetail.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Experience Level</h3>
                    <p className="text-gray-600">{jobDetail.experience}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Category</h3>
                    <p className="text-gray-600">{jobDetail.category}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                jobDetail.active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {jobDetail.active ? 'Active' : 'Inactive'}
              </span>
              <div className="mt-4 text-sm text-gray-500">
                Posted on {formatDate(jobDetail.created)}
              </div>
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Applications ({jobDetail.applications.length})
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Processed: {jobDetail.applications.filter(app => app.processed).length}
              </span>
              <span className="text-gray-600">
                Pending: {jobDetail.applications.filter(app => !app.processed).length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobDetail.applications.map((application) => (
                  <tr 
                    key={application.applicationId}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {application.candidateName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(application.appliedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        application.processed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.processed ? (
                          <><FiCheck className="mr-1" /> Processed</>
                        ) : (
                          <><FiClock className="mr-1" /> Pending</>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewApplication(application.applicationId)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkProcessed(application.applicationId);
                        }}
                        className={`${
                          application.processed
                            ? 'text-gray-600 hover:text-gray-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {application.processed ? 'Mark Unprocessed' : 'Mark Processed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostedJobDetail;