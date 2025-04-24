import apiService from "./apiService.js";
import { toast } from "react-toastify";

export const companyService = {
    createCompany: async (companyData) =>
        await apiService.post(`/company/register`, companyData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getCompany: async () =>
        await apiService.get(`/company/mycompany`),

    updateCompany: async (companyData) =>
        await apiService.put(`/company/mycompany`, companyData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

    getInvitation: async (token) =>
        await apiService.get(`/invitation/${token}`),

    getInvitations: async (page = 0, size = 2) =>
        await apiService.get(`/invitation?page=${page}&size=${size}`),

    acceptInvitation: async (token) =>
        await apiService.post(`/invitation/join`, null, {
            params: { token: token }
        }),

    getCompanyMembers: async (page, size) =>
        await apiService.get(`/company/mycompany/members?page=${page}&size=${size}`),

    inviteMember: async (email) =>
        await apiService.post(`/invitation/invite`, { email }),
    getCompanyById: async (id) =>
        await apiService.get(`/company/${id}`),

};
