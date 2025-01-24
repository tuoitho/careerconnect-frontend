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
}
