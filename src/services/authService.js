import axios from "axios";
import apiService from "./apiService.js";

export const authService = {
  // Đăng nhập

  async login(username, password, tk,config) {
    try {
      if (config===0)
      {
        console.log("vào đây");

        const a = axios.create({
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 1,
        });
      // lấy từ biến môi trường
      return a.post("/auth/login",
          {
            username,
            password,
          },
          {
            params: {
              tk: tk, // Add as URL parameter
            },
            withCredentials: true,
          },
        );
      } else{
        console.log("vào đây bth");
      return await apiService.post(
        "/auth/login",
        {
          username,
          password,
        },
        {
          // params: {
          //   tk: tk, // Add as URL parameter
          // },
          withCredentials: true,
        },

      );}
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
