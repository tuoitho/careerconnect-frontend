import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaBriefcase,
  FaList,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartLine,
  FaTag,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import Sidebar from "../components/recruiter/Sidebar";
import { jobService } from "../services/jobService";
import LoadingSpinner from "../components/LoadingSpinner";

const JobManagement = () => {
  // Các state để quản lý danh sách job và các modal
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" hoặc "edit"
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // State to store the list of jobs
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Danh sách các loại công việc
  const jobTypes = [
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "TEMPORARY", label: "Temporary" },
    { value: "VOLUNTEER", label: "Volunteer" },
    { value: "FREELANCE", label: "Freelance" },
  ];

  // Danh sách các mức kinh nghiệm
  const experienceLevels = [
    { value: "ENTRY_LEVEL", label: "Entry Level" },
    { value: "MID_LEVEL", label: "Mid Level" },
    { value: "SENIOR_LEVEL", label: "Senior Level" },
    { value: "EXECUTIVE", label: "Executive" },
    { value: "NO_EXPERIENCE", label: "No Experience" },
    { value: "INTERN", label: "Intern" },
    { value: "FRESHER", label: "Fresher" },
  ];

  // Danh sách các danh mục công việc
  const jobCategories = [
    { value: "IT", label: "Information Technology" },
    { value: "FINANCE", label: "Finance" },
    { value: "HEALTHCARE", label: "Healthcare" },
    { value: "EDUCATION", label: "Education" },
    { value: "ENGINEERING", label: "Engineering" },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Lấy danh sách job khi component load
  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobs(currentPage, pageSize);
      setJobList(response.result.data);
      setTotalPages(response.result.totalPages);
    } catch (error) {
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Mở modal thêm job
  const openAddModal = () => {
    console.log("openAddModal");
    setModalType("add");
    setSelectedJob(null);
    reset({});
    console.log(selectedJob);
    setModalOpen(true);
  };
  useEffect(() => {
    reset(selectedJob);
  }, [modalOpen]);
  // Mở modal sửa job, truyền dữ liệu job hiện tại vào form
  const openEditModal = (job) => {
    setModalType("edit");
    setSelectedJob(job);
    reset(job); // đổ dữ liệu vào form
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Xử lý submit form thêm/sửa job
  const onSubmit = async (data) => {
    try {
      if (modalType === "add") {
        const response = await jobService.createJob(data);
        toast.success(response.message);
      } else if (modalType === "edit") {
        const response = await jobService.updateJob(selectedJob.jobId, data);
        toast.success(response.message);
      }
      closeModal();
      fetchJobs();
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    }
  };

  // Xóa job
  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure to delete this job?")) {
      try {
        const response = await jobService.deleteJob(jobId);
        toast.success(response.message);
        fetchJobs();
      } catch (error) {
        toast.error("Failed to delete job.");
      }
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        {/* Header với nút thêm job */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Job Listings</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
          >
            <FaPlus className="mr-2" /> Add Job
          </button>
        </div>

        {/* Loading state */}
        {loading && <LoadingSpinner />}

        {!loading && (
          <div>
            {/* Bảng hiển thị danh sách job */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Deadline</th>
                    <th className="px-6 py-3 text-left">Posted Date</th>
                    <th className="px-6 py-3 text-left">Active</th>
                    {/* New column */}
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobList.map((job, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">{job.title}</td>
                      <td className="px-6 py-4">{job.location}</td>
                      <td className="px-6 py-4">{job.type}</td>
                      <td className="px-6 py-4">
                        {new Date(job.deadline).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {/* Hiển thị ngày đăng */}
                        {new Date(job.created).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {job.active ? (
                          <FaToggleOn className="text-green-500" />
                        ) : (
                          <FaToggleOff className="text-red-500" />
                        )}
                        {/* Show active status */}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => openEditModal(job)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(job.jobId)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => openDetailsModal(job)}
                          className="text-green-500 hover:text-green-700"
                          title="Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>

            {/* Existing job details code */}
            {jobDetails && (
              <div className="mt-6 bg-white shadow-md rounded p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {jobDetails.title}
                </h3>
                <p>
                  <strong>Type:</strong> {jobDetails.type}
                </p>
                <p>
                  <strong>Deadline:</strong>
                  {new Date(jobDetails.deadline).toLocaleString()}
                </p>
                <p>
                  <strong>Applicants:</strong> {jobDetails.applicantsCount || 0}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Thêm/Sửa Job */}
        {modalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {modalType === "add" ? "Add New Job" : "Edit Job"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800 text-2xl"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Job Title */}
                {/* Hidden Job ID Field */}

                <input
                  type="hidden"
                  {...register("id")}
                  value={selectedJob?.jobId}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                    <input
                      {...register("title", {
                        required: "Job title is required",
                      })}
                      type="text"
                      className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-600 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description*
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                      <FaList className="text-gray-400" />
                    </div>
                    <textarea
                      {...register("description", {
                        required: "Job description is required",
                      })}
                      rows={4}
                      className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter job description..."
                    ></textarea>
                  </div>
                  {errors.description && (
                    <p className="text-red-600 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      {...register("location", {
                        required: "Location is required",
                      })}
                      type="text"
                      className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. New York, NY"
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-600 text-sm">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Job Type & Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Type*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <select
                        {...register("type", {
                          required: "Job type is required",
                        })}
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select job type</option>
                        {jobTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.type && (
                      <p className="text-red-600 text-sm">
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Application Deadline*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        {...register("deadline", {
                          required: "Deadline is required",
                        })}
                        type="datetime-local"
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    {errors.deadline && (
                      <p className="text-red-600 text-sm">
                        {errors.deadline.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Experience Level & Job Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Experience Level*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaChartLine className="text-gray-400" />
                      </div>
                      <select
                        {...register("experience", {
                          required: "Experience level is required",
                        })}
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select experience level</option>
                        {experienceLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.experience && (
                      <p className="text-red-600 text-sm">
                        {errors.experience.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Category*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTag className="text-gray-400" />
                      </div>
                      <select
                        {...register("category", {
                          required: "Job category is required",
                        })}
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select job category</option>
                        {jobCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.category && (
                      <p className="text-red-600 text-sm">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Minimum Salary
                    </label>
                    <div className="relative">
                      <input
                        {...register("minSalary")}
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 50000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Salary
                    </label>
                    <div className="relative">
                      <input
                        {...register("maxSalary")}
                        className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. 100000"
                      />
                    </div>
                  </div>
                </div>

                {/* Job Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaToggleOn className="text-gray-400" />
                    </div>
                    <select
                      {...register("active")}
                      className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Nút submit */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    {modalType === "add" ? "Add Job" : "Update Job"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobManagement;
