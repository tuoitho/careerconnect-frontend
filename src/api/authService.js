import apiService from "./apiService";
import { toast } from "react-toastify";

export const authService = {
  // Đăng nhập
  async login(username, password, tk) {
    try {
      return await apiService.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          params: {
            tk: tk, // Add as URL parameter
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      //tiếp tục throw error để component gọi hàm này xử lý
      throw error;
    }
  },

  // Đăng xuất
  async logout() {
    try {
      return await apiService.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
      apiService.clearAuthToken();
    }
    finally {
      apiService.clearAuthToken();
    }
  },
};
