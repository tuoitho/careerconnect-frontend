import apiService from "../api/apiService";
import { toast } from "react-toastify";

// Định nghĩa kiểu dữ liệu
interface CompanyData {
  name: string;
  address?: string;
  [key: string]: any; // Cho phép các thuộc tính bổ sung
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const companyService = {
  createCompany: async (companyData: CompanyData): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.post<ApiResponse<any>>(`/recruiter/company`, companyData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      toast.error(`Lỗi tại createCompany: ${error.message}`);
    }
  },

  getCompany: async (): Promise<ApiResponse<any> | void> => {
    try {
      const response = await apiService.get<ApiResponse<any>>(`/recruiter/company`);
      console.log(response);
      return response;
    } catch (error: any) {
      toast.error(`Lỗi tại getCompany: ${error.message}`);
    }
  },

  updateCompany: async (companyData: CompanyData): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.put<ApiResponse<any>>(`/recruiter/company`, companyData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      toast.error(`Lỗi tại updateCompany: ${error.message}`);
    }
  },

  getInvitation: async (token: string): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.get<ApiResponse<any>>(`/recruiter/invitation/${token}`);
    } catch (error: any) {
      toast.error(`Lỗi tại getInvitation: ${error.message}`);
    }
  },

  getInvitations: async (page: number = 0, size: number = 2): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.get<ApiResponse<any>>(`/recruiter/invitation?page=${page}&size=${size}`);
    } catch (error: any) {
      toast.error(`Lỗi tại getInvitations: ${error.message}`);
    }
  },

  acceptInvitation: async (token: string): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.post<ApiResponse<any>>(`/recruiter/company/accept`, null, {
        params: { token },
      });
    } catch (error: any) {
      toast.error(`Lỗi tại acceptInvitation: ${error.message}`);
    }
  },

  getCompanyMembers: async (page: number, size: number): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.get<ApiResponse<any>>(`/recruiter/company/member?page=${page}&size=${size}`);
    } catch (error: any) {
      toast.error(`Lỗi tại getCompanyMembers: ${error.message}`);
    }
  },

  inviteMember: async (email: string): Promise<ApiResponse<any> | void> => {
    try {
      return await apiService.post<ApiResponse<any>>(`/recruiter/company/addmember`, { email });
    } catch (error: any) {
      toast.error(`Lỗi tại inviteMember: ${error.message}`);
    }
  },
};
