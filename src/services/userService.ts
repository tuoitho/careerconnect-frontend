import apiService from "../api/apiService";
import { toast } from "react-toastify";

// Định nghĩa kiểu dữ liệu cho userData
interface UserData {
  username: string;
  email: string;
  password: string;
}

// Định nghĩa kiểu trả về của API (ví dụ: thông tin user sau khi đăng ký)
interface ApiResponse {
  success: boolean;
  message: string;
  data: any; // Dữ liệu trả về sau khi đăng ký thành công
}

export const registerUser = async (userData: UserData): Promise<ApiResponse | void> => {
  try {
    const response = await apiService.post<ApiResponse>("/auth/register", userData);
    return response;
  } catch (error: any) {
    toast.error(`Lỗi tại registerUser: ${error.message}`);
  }
};
