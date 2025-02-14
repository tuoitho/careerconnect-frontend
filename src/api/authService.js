import apiService from "./apiService";
import { toast } from "react-toastify";

export const authService = {
  // Đăng nhập
  async login(username, password) {
    try {
      return await apiService.post("/auth/login", {
        username,
        password,
      }, {
        withCredentials: true
      });
    } catch (error) {
      //tiếp tục throw error để component gọi hàm này xử lý
      throw error;
    }
  },

  // Đăng xuất
  async logout() {
    try {
      await apiService.post("/auth/logout");
      apiService.clearAuthToken();
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xóa tokens ở client side ngay cả khi API fails
      apiService.clearAuthToken();
    }
  },
};
