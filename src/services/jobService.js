import apiService from "../api/apiService";

export const jobService = {
    createJob: async (jobData) => {
        return await apiService.post(`/recruiter/jobs`, jobData);
    },
    getPostedJobDetail: async (id) => {
        return await apiService.get(`/recruiter/jobs/${id}`);
    },
    getJobs: async (page = 0, size = 3) => {
         return await apiService.get(`/recruiter/jobs?page=${page}&size=${size}`);
    },
    updateJob: async (id, jobData) => {
        return await apiService.put(`/recruiter/jobs/${id}`, jobData);
    },
    deleteJob: async (id) => {
        return await apiService.delete(`/recruiter/jobs/${id}`);
    },
    getCompanyJobs: async (companyId, page = 0, size = 4) => {
        return await apiService.get(`/company/jobs?companyId=${companyId}&page=${page}&size=${size}`);
    },
    applyJob: async (applyJobdata) => {
        return await apiService.post(`/job/apply`, applyJobdata);
    },
    searchJobs: async (params) => {
        return await apiService.get(`/company/jobs/search`, { params });
    },
    getCompanyJobDetail: async (id) => {
        return await apiService.get(`/company/jobs/${id}`);
    },
}