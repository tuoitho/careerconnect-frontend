import { toast } from 'react-toastify';
import apiService from "../api/apiService";

export const jobService = {
    createJob: async (jobData) => {
        try {
            return await apiService.post(`/recruiter/jobs`, jobData);
        } catch (error) {
            toast.error("Lỗi tại createJob:", error.message);
        }
    },
    getJob: async (id) => {
        try {
            return await apiService.get(`/recruiter/jobs/${id}`);
        } catch (error) {
            toast.error("Lỗi tại getJob:", error.message);
        }
    },
    getJobs: async (page = 0, size = 2) => {
        try {
            return await apiService.get(`/recruiter/jobs?page=${page}&size=${size}`);
        } catch (error) {
            toast.error("Lỗi tại getJobs:", error.message);
        }
    },
    updateJob: async (jobData) => {
        try {
            return await apiService.put(`/recruiter/jobs`, jobData);
        } catch (error) {
            toast.error("Lỗi tại updateJob:", error.message);
        }
    },
    deleteJob: async (id) => {
        try {
            return await apiService.delete(`/recruiter/jobs/${id}`);
        } catch (error) {
            toast.error("Lỗi tại deleteJob:", error.message);
        }
    },
    getJobByCompany: async (companyId) => {
        try {
            return await apiService.get(`/recruiter/jobs/company/${companyId}`); 
        } catch (error) {
            toast.error("Lỗi tại getJobByCompany:", error.message);
        }

    }
}