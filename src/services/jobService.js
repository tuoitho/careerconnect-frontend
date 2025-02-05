import apiService from "../api/apiService";

export const jobService = {
    createJob: async (jobData) => {
        return await apiService.post(`/recruiter/jobs`, jobData);
    },
    getJob: async (id) => {
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
    getJobByCompany: async (companyId) => {
        return await apiService.get(`/recruiter/jobs/company/${companyId}`); 
    }
}