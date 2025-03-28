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
    this.currentAuthToken = localStorage.getItem("access_token") || null;
  }

  setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: new Date() };

        // Kiểm tra nếu endpoint không yêu cầu Authorization
        const excludedEndpoints = ["/auth/login", "/auth/refresh-token"];
        if (!excludedEndpoints.includes(config.url)) {
          const token = localStorage.getItem("access_token");
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
            const data = await this.refreshAuthToken();
            
            // Kiểm tra accessToken hợp lệ
            if (!data?.accessToken) {
              throw new Error('Invalid refresh token response');
            }
            const newToken = data?.accessToken;
            console.log("Refresh token successful, new token:", newToken);
            localStorage.setItem("access_token", newToken);
            this.currentAuthToken = newToken;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return this.instance(originalRequest); // Thử lại request gốc
          } catch (refreshError) {
            // Xử lý trường hợp refresh token hết hạn
            if (refreshError.response?.status === 401) {
              this.clearAuthToken();
              window.location.href = "/login?session_expired=true";
            }
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
          // Kiểm tra nếu là request đăng nhập
          if (originalRequest.url === "/auth/login") {
            // Thử lại request đăng nhập do có thể bị chặn
            if (!originalRequest._internetRetry) {
              originalRequest._internetRetry = true;
              // toast.info("Đang thử kết nối lại...");
              return new Promise(resolve => {
                setTimeout(() => {
                  resolve(this.instance(originalRequest));
                }, 0);
              });
            }
          }
          return Promise.reject({ message: "Lỗi internet, vui lòng thử lại lần nữa!" });
        } else {
          // Lỗi khác
          toast.error("Unknown error occurred.");
          return Promise.reject(error);
        }
      }
  
    );
  }


  // Auth methods
  setAuthToken(token) {
    localStorage.setItem("access_token", token);
    this.currentAuthToken = token;
  }

  clearAuthToken() {
    localStorage.removeItem("access_token");
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
