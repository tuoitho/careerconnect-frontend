import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaBriefcase,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaClock,
  FaList,
  FaCalendarAlt,
  FaChartLine,
  FaTag,
  FaToggleOn,
} from "react-icons/fa";
import Sidebar from "../components/recruiter/Sidebar";
import { jobService } from "../services/jobService";

const PostJob = () => {
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
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Gửi dữ liệu lên backend
      console.log(data);
      const response = await jobService.createJob(data);
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to post job. Please try again.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Post a New Job</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="title">
                Job Title*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBriefcase className="text-gray-400" />
                </div>
                <input
                  {...register("title", { required: "Job title is required" })}
                  id="title"
                  type="text"
                  className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                Job Description*
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                  <FaList className="text-gray-400" />
                </div>
                <textarea
                  {...register("description", { required: "Job description is required" })}
                  id="description"
                  rows={6}
                  className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter job description..."
                ></textarea>
              </div>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="location">
                Location*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  {...register("location", { required: "Location is required" })}
                  id="location"
                  type="text"
                  className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. New York, NY"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="type">
                Job Type*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaClock className="text-gray-400" />
                </div>
                <select
                  {...register("type", { required: "Job type is required" })}
                  id="type"
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
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="minSalary">
                  Minimum Salary
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMoneyBillWave className="text-gray-400" />
                  </div>
                  <input
                    {...register("minSalary")}
                    id="minSalary"
                    type="text"
                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. $50,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="maxSalary">
                  Maximum Salary
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMoneyBillWave className="text-gray-400" />
                  </div>
                  <input
                    {...register("maxSalary")}
                    id="maxSalary"
                    type="text"
                    className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. $80,000"
                  />
                </div>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="deadline">
                Application Deadline*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  {...register("deadline", { required: "Deadline is required" })}
                  id="deadline"
                  type="datetime-local"
                  className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline.message}</p>}
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="experience">
                Experience Level*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaChartLine className="text-gray-400" />
                </div>
                <select
                  {...register("experience", { required: "Experience level is required" })}
                  id="experience"
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
              {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>}
            </div>

            {/* Job Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
                Job Category*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="text-gray-400" />
                </div>
                <select
                  {...register("category", { required: "Job category is required" })}
                  id="category"
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
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="active">
                Job Status
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaToggleOn className="text-gray-400" />
                </div>
                <select
                  {...register("active")}
                  id="active"
                  className="pl-10 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;