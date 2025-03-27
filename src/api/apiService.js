// apiService.js
import axios from "axios";
import { toast } from "react-toastify";

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 13000,
    });

    this.setupInterceptors();
    this.currentAuthToken = localStorage.getItem("authToken") || null;
  }

  setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: new Date() };
        const excludedEndpoints = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/google"];
        if (!excludedEndpoints.includes(config.url)) {
          const token = localStorage.getItem("authToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log("Attempting to refresh token...");
            const response = await this.refreshAuthToken(); // Chờ refresh token hoàn tất
            const newToken = response.accessToken;
            if (!newToken) {
              throw new Error("No access token returned from refresh");
            }

            console.log("Refresh token successful, new token:", newToken);
            localStorage.setItem("authToken", newToken);
            this.currentAuthToken = newToken;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return this.instance(originalRequest); // Thử lại request gốc
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError.message || refreshError);
            this.clearAuthToken();
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        if (error.response) {
          return Promise.reject(error.response.data);
        } else if (error.request) {
          if (originalRequest.url === "/auth/login" && !originalRequest._internetRetry) {
            originalRequest._internetRetry = true;
            return new Promise((resolve) => {
              setTimeout(() => resolve(this.instance(originalRequest)), 0);
            });
          }
          return Promise.reject({ message: "Lỗi internet, vui lòng thử lại lần nữa!" });
        } else {
          toast.error("Unknown error occurred.");
          return Promise.reject(error);
        }
      }
    );
  }

  async refreshAuthToken() {
    const currentToken = localStorage.getItem("authToken");
    if (!currentToken) {
      throw new Error("No auth token available to refresh");
    }

    try {
      console.log("Sending refresh token request with token:", currentToken);
      const response = await this.instance.post(
        "/auth/refresh-token",
        { token: currentToken },
        { withCredentials: true }
      );
      console.log("Refresh token response:", response);
      return response; // Trả về toàn bộ response.data
    } catch (error) {
      console.error("Refresh token request failed:", error.response?.data || error.message);
      throw error;
    }
  }

  setAuthToken(token) {
    localStorage.setItem("authToken", token);
    this.currentAuthToken = token;
  }

  clearAuthToken() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    this.currentAuthToken = null;
  }

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
}

const apiService = new ApiService();
export default apiService;