import apiService from "../api/apiService";
import {toast} from "react-toastify";

export const companyService = {
    createCompany: async (companyData) => {
        try {
            return await apiService.post(`/recruiter/company`, companyData,{
                headers: {
                    'Content-Type': 'multipart/form-data', // Ghi đè Content-Type
                }
            });
        } catch (error) {
            toast.error("Lỗi tại createCompany:", error.message);
        }
    },
    getCompany: async () => {
        try {
            return await apiService.get(`/recruiter/company`);
        } catch (error) {
            toast.error("Lỗi tại getCompany:", error.message);
        }
    },
    updateCompany: async (companyData) => {
        try {
            return await apiService.put(`/recruiter/company`, companyData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ghi đè Content-Type
                }
            });
        } catch (error) {
            toast.error("Lỗi tại updateCompany:", error.message);
        }
    },
    getInvitation: async (token) => {
        try {
            return await apiService.get(`/recruiter/invitation/${token}`);
        } catch (error) {
            toast.error("Lỗi tại getInvitation:", error.message);
        }
    },
    getInvitations: async (page = 0, size = 2) => {
        try {
            return await apiService.get(`/recruiter/invitation?page=${page}&size=${size}`);
        } catch (error) {
            toast.error("Lỗi tại getInvitations:", error.message);
        }
    },

    acceptInvitation: async (token) => {
        try {
            return await apiService.post(`/recruiter/company/accept`, null, {
                params: {
                    token: token
                }
            });
        }
        catch (error) {
            toast.error("Lỗi tại acceptInvitation:", error.message);
        }
    },
    getCompanyMembers: async (page, size) => {
        try {
            return await apiService.get(`/recruiter/company/member?page=${page}&size=${size}`);
        } catch (error) {
            toast.error("Lỗi tại getCompanyMembers:", error.message);
        }
    },
    inviteMember: async (email) => {
        try {
            return await apiService.post(`/recruiter/company/addmember`, {email: email});
        } catch (error) {
            toast.error("Lỗi tại inviteMember:", error.message);
        }
    },
}
