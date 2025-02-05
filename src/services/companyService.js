import apiService from "../api/apiService";
import { toast } from "react-toastify";

export const companyService = {
    createCompany: async (companyData) => 
        await apiService.post(`/recruiter/company`, companyData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getCompany: async () => 
        await apiService.get(`/recruiter/company`),

    updateCompany: async (companyData) => 
        await apiService.put(`/recruiter/company`, companyData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getInvitation: async (token) => 
        await apiService.get(`/recruiter/invitation/${token}`),

    getInvitations: async (page = 0, size = 2) => 
        await apiService.get(`/recruiter/invitation?page=${page}&size=${size}`),

    acceptInvitation: async (token) => 
        await apiService.post(`/recruiter/company/accept`, null, {
            params: { token: token }
        }),

    getCompanyMembers: async (page, size) => 
        await apiService.get(`/recruiter/company/member?page=${page}&size=${size}`),

    inviteMember: async (email) => 
        await apiService.post(`/recruiter/company/addmember`, { email }),
};
