import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  MapPin,
  Briefcase,
  DollarSign,
  Tag,
  BookmarkPlus,
  Bookmark,
  Users,
  Clock,
} from "lucide-react";
import Loading2 from "../components/Loading2";
import { useParams } from "react-router-dom";
import { jobService } from "../services/jobService";
import { companyService } from "../services/companyService";
import  cvService from "../services/cvService";
import apiService from "../services/apiService.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [userCVs, setUserCVs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicantCount, setApplicantCount] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State cho modal xác nhận

  const fetchData = async () => {
    try {
      setLoading(true);
      const jobResponse = await jobService.getCompanyJobDetail(id);
      setJobDetails(jobResponse.result);
      if (jobResponse.result?.companyId) {
        const companyResponse = await companyService.getCompanyById(
          jobResponse.result.companyId
        );
        setCompanyInfo(companyResponse.result);
      }
      // const cvResponse = await cvService.getUserCVs();
      const cvResponse = null; // Chưa có API lấy CV của người dùng
      setUserCVs(cvResponse.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmitApplication = async () => {
    if (!selectedCV || !coverLetter.trim()) {
      alert("Vui lòng chọn CV và viết thư giới thiệu");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await jobService.applyJob({
        jobId: id,
        cvId: selectedCV,
        coverLetter: coverLetter.trim(),
      });
      toast.success(response.message);
      fetchData();
      setIsApplyModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCV("");
    setCoverLetter("");
  };

  const handleSaveJob = async () => {
    try {
      setLoading(true);
      if (jobDetails.saved) {
        const resp = await apiService.delete(`/saved-jobs/${id}`);
        setJobDetails((prev) => ({ ...prev, saved: false }));
        toast.info(resp.message);
      } else {
        const resp = await apiService.post(`/saved-jobs/${id}`, {});
        setJobDetails((prev) => ({ ...prev, saved: true }));
        toast.success(resp.message);
      }
    } catch (error) {
      toast.error(error.message || "Không thể lưu tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplicants = async () => {
    setIsConfirmModalOpen(true); // Mở modal xác nhận
  };

  const confirmViewApplicants = async () => {
    try {
      setLoading(true);
      const countResponse = await apiService.post(`/company/jobs/${id}/view-applicants`);
      toast.success("Đã trừ 1 xu. Xem số lượng ứng viên trong giao diện.");
      setApplicantCount(countResponse.result); // Giả sử API trả về số lượng trực tiếp
      console.log("Applicants data:", countResponse.result);
    } catch (error) {
      toast.error(error.message || "Không thể xem danh sách ứng viên");
    } finally {
      setIsConfirmModalOpen(false); // Đóng modal sau khi xử lý
      setLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    return `${min && min !== "0" ? `$${min}` : ""} ${
      max && max !== "0" ? `- $${max}` : ""
    }`.trim();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {loading && <Loading2 />}
      {/* Apply Modal */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !isSubmitting && setIsApplyModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-8 w-full max-w-2xl animate-fade-in shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Apply for: {jobDetails?.title}
              </h3>
              <button
                onClick={() => !isSubmitting && setIsApplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select CV *
              </label>
              <select
                value={selectedCV}
                onChange={(e) => setSelectedCV(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm"
                disabled={isSubmitting}
              >
                <option value="">-- Select your CV --</option>
                {userCVs.map((cv) => (
                  <option key={cv.cvId} value={cv.cvId}>
                    {cv.name} - Updated:{" "}
                    {new Date(cv.updatedAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-3 border rounded-lg h-40 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm resize-none"
                placeholder="Write your cover letter here..."
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  if (!isSubmitting) {
                    setIsApplyModalOpen(false);
                    resetForm();
                  }
                }}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 font-medium transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Xác nhận xem danh sách ứng viên
            </h3>
            <p className="text-gray-600 mb-6">
              Hành động này sẽ tiêu tốn{" "}
              <span className="font-semibold text-green-600">1 xu</span>. Bạn có
              muốn tiếp tục không?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmViewApplicants}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-green-600 mb-2">
                  {jobDetails?.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  <p>{jobDetails?.location}</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                {jobDetails?.type}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-green-500" />
                <p className="text-gray-700">
                  <span className="font-medium text-green-700">Salary:</span>{" "}
                  {formatSalary(jobDetails?.minSalary, jobDetails?.maxSalary)}
                </p>
              </div>
              <div className="flex items-center">
                <Tag className="w-6 h-6 mr-2 text-green-500" />
                <p className="text-gray-700">
                  <span className="font-medium text-green-700">Category:</span>{" "}
                  {jobDetails?.category}
                </p>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-6 h-6 mr-2 text-green-500" />
                <p className="text-gray*Math.floor(gray-700">
                  <span className="font-medium text-green-700">Deadline:</span>{" "}
                  {formatDate(jobDetails?.deadline)}
                </p>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2 text-green-500" />
                <p className="text-gray-700">
                  <span className="font-medium text-green-700">Posted:</span>{" "}
                  {formatDate(jobDetails?.created)}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-green-600 mb-3">
                Job Description
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {jobDetails?.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className={`bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors duration-300 font-semibold flex items-center justify-center flex-1 ${
                  jobDetails?.applied ? "bg-gray-400 cursor-not-allowed" : ""
                }`}
                disabled={jobDetails?.applied}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                {jobDetails?.applied ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
              </button>
              <button
                onClick={handleSaveJob}
                className={`px-6 py-3 rounded-md font-semibold flex items-center justify-center flex-1 transition-colors duration-300 ${
                  jobDetails?.saved
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {jobDetails?.saved ? (
                  <>
                    <Bookmark className="w-5 h-5 mr-2" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-5 h-5 mr-2" />
                    Lưu Job
                  </>
                )}
              </button>
            </div>

            {/* View Applicants Section */}
            <div className="flex items-center justify-end text-gray-600">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              {applicantCount !== null ? (
                <span className="text-green-600 font-semibold mr-2 bg-green-100 px-2 py-1 rounded-full animate-pulse">
                  {applicantCount} Applicants
                </span>
              ) : null}
              <button
                onClick={handleViewApplicants}
                className="text-green-500 hover:text-green-600 font-medium"
              >
                View Applicants
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Company Info */}
        <div className="lg:col-span-1">
          {companyInfo && (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Company Information
              </h2>
              <div className="flex flex-col items-center">
                <img
                  src={companyInfo?.logo}
                  alt="Company logo"
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-green-100 cursor-pointer hover:opacity-90 transition-opacity duration-300"
                  onClick={() =>
                    companyInfo?.companyId &&
                    navigate(`/candidate/company/${companyInfo?.companyId}`)
                  }
                />
                <h3
                  className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-green-600 transition-colors duration-300"
                  onClick={() =>
                    companyInfo?.companyId &&
                    navigate(`/candidate/company/${companyInfo?.companyId}`)
                  }
                >
                  {companyInfo?.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 text-center">
                  <MapPin className="inline w-4 h-4 mr-1 text-green-500" />
                  {companyInfo?.address}
                </p>
                <a
                  href={companyInfo?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm mb-4"
                >
                  {companyInfo?.website.replace(/^https?:\/\//, "")}
                </a>
                <div className="w-full">
                  <h4 className="font-semibold text-gray-700 mb-2">About Us</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {companyInfo?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
