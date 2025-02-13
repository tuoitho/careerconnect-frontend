import apiService from "../api/apiService";
import { toast } from "react-toastify";

export const companyService = {
    createCompany: async (companyData) => 
        await apiService.post(`/recruiter/mycompany`, companyData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getCompany: async () => 
        await apiService.get(`/recruiter/mycompany`),

    updateCompany: async (companyData) => 
        await apiService.put(`/recruiter/mycompany`, companyData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getInvitation: async (token) => 
        await apiService.get(`/invitation/${token}`),

    getInvitations: async (page = 0, size = 2) => 
        await apiService.get(`/invitation?page=${page}&size=${size}`),

    acceptInvitation: async (token) => 
        await apiService.post(`/company/accept`, null, {
            params: { token: token }
        }),

    getCompanyMembers: async (page, size) => 
        await apiService.get(`/company/members?page=${page}&size=${size}`),

    inviteMember: async (email) => 
        await apiService.post(`/company/addmember`, { email }),
    getCompanyById: async (id) => 
        await apiService.get(`/company/${id}`),

};
