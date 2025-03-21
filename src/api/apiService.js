// apiService.js
import axios from "axios";
import { toast } from "react-toastify";

// "http://localhost:1111"||
class ApiService {
  constructor() {
    this.instance = axios.create({
      // baseURL: process.env.REACT_APP_API_URL,
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 13000,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: new Date() };

        // Kiểm tra nếu endpoint không yêu cầu Authorization
        const excludedEndpoints = ["/auth/login"];
        if (!excludedEndpoints.includes(config.url)) {
          const token = localStorage.getItem("authToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          } 
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            //lấy từ cookie ở backend rồi
            const response = await this.refreshAuthToken();
            localStorage.setItem("authToken", response.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.token}`;

            return this.instance(originalRequest);
          } catch (refreshError) {
            this.clearAuthToken();
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
          // Xử lý lỗi khác không phải lỗi 401
        if (error.response) {
          // Lỗi từ phía server
          // ném ra để bắt ở component
          return Promise.reject(error.response.data);
          // toast.error(error.response.data.message);
        } else if (error.request) {
          // Không nhận được phản hồi từ server
          // return Promise.reject(error);
          return Promise.reject({ message: "Lỗi internet, vui lòng thử lại lần nữa!" });
        } else {
          // Lỗi khác
          toast.error("Unknown error occurred.");
          return Promise.reject(error);
        }
      }
  
    );
  }
  // handleError(error) {
  //   console.error("Request failed:", error.response.data);
  //   let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";

  //   if (error.response) {
  //     const { status, data } = error.response;
  //     errorMessage = data.message || `HTTP Error ${status}`;
  //   } else if (error.request) {
  //     errorMessage = "Network error: Please check your internet connection.";
  //   } else {
  //     errorMessage = error.message || "Unknown error occurred.";
  //   }
  //   // Hiển thị thông báo lỗi (nếu dùng thư viện như toast)
  //   toast.error(errorMessage);
  // }

  // Auth methods
  setAuthToken(token) {
    localStorage.setItem("authToken", token);
  }

  clearAuthToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  // HTTP methods
  async get(url, config = {}) {
    return this.instance.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.instance.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.instance.delete(url, config);
  }

  async refreshAuthToken() {
    return this.instance.post("/auth/refresh-token", {} , {
        withCredentials: true,
      }
    );
  }
}

const apiService = new ApiService();
export default apiService;
