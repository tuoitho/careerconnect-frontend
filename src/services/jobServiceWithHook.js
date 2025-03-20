import { useApi } from '../hooks/useApi';
import apiService from '../api/apiService';

export const useJobService = () => {
  // Lấy chi tiết đơn ứng tuyển
  const getApplicationDetailApi = useApi(
    async (applicationId) => await apiService.get(`/application/${applicationId}`),
    { showSuccessToast: false }
  );

  // Tạo công việc mới
  const createJobApi = useApi(
    async (jobData) => await apiService.post(`/recruiter/jobs`, jobData),
    { showSuccessToast: true }
  );

  // Lấy chi tiết công việc đã đăng
  const getPostedJobDetailApi = useApi(
    async (id) => await apiService.get(`/recruiter/jobs/${id}`),
    { showSuccessToast: false }
  );

  // Lấy danh sách công việc
  const getJobsApi = useApi(
    async (page = 0, size = 3) => await apiService.get(`/recruiter/jobs?page=${page}&size=${size}`),
    { showSuccessToast: false }
  );

  // Cập nhật công việc
  const updateJobApi = useApi(
    async (id, jobData) => await apiService.put(`/recruiter/jobs/${id}`, jobData),
    { showSuccessToast: true }
  );

  // Xóa công việc
  const deleteJobApi = useApi(
    async (id) => await apiService.delete(`/recruiter/jobs/${id}`),
    { showSuccessToast: true }
  );

  // Lấy danh sách công việc của công ty
  const getCompanyJobsApi = useApi(
    async (companyId, page = 0, size = 4) => 
      await apiService.get(`/company/jobs?companyId=${companyId}&page=${page}&size=${size}`),
    { showSuccessToast: false }
  );

  // Ứng tuyển công việc
  const applyJobApi = useApi(
    async (applyJobdata) => await apiService.post(`/job/apply`, applyJobdata),
    { showSuccessToast: true }
  );

  // Tìm kiếm công việc
  const searchJobsApi = useApi(
    async (params) => await apiService.get(`/company/jobs/search`, { params }),
    { showSuccessToast: false }
  );

  // Lấy chi tiết công việc của công ty
  const getCompanyJobDetailApi = useApi(
    async (id) => await apiService.get(`/company/jobs/${id}`),
    { showSuccessToast: false }
  );

  // Lấy danh sách công việc đã ứng tuyển
  const getAllAppliedJobsApi = useApi(
    async (page = 0, size = 3) => await apiService.get(`/job/applied?page=${page}&size=${size}`),
    { showSuccessToast: false }
  );

  return {
    getApplicationDetail: getApplicationDetailApi,
    createJob: createJobApi,
    getPostedJobDetail: getPostedJobDetailApi,
    getJobs: getJobsApi,
    updateJob: updateJobApi,
    deleteJob: deleteJobApi,
    getCompanyJobs: getCompanyJobsApi,
    applyJob: applyJobApi,
    searchJobs: searchJobsApi,
    getCompanyJobDetail: getCompanyJobDetailApi,
    getAllAppliedJobs: getAllAppliedJobsApi
  };
};