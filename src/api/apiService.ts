// apiService.ts
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "https://reqres.in",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        // Ép kiểu để tránh lỗi metadata
        (config as any).metadata = { startTime: new Date() };
        // Kiểm tra nếu endpoint không yêu cầu Authorization
        const excludedEndpoints = ["/auth/login"];
        if (!excludedEndpoints.includes(config.url!)) {
          const authToken = localStorage.getItem("authToken");
          if (authToken) {
            config.headers!.Authorization = `Bearer ${authToken}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await this.refreshAuthToken(refreshToken!);

            localStorage.setItem("authToken", response.accessToken);
            originalRequest.headers!.Authorization = `Bearer ${response.token}`;

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
          toast.error((error.response.data as { message: string }).message);
        } else if (error.request) {
          // Không nhận được phản hồi từ server
          toast.error("Network error: Please check your internet connection.");
        } else {
          // Lỗi khác
          console.log("di vao day2", error);
          toast.error("Unknown error occurred.");
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  public setAuthToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  public clearAuthToken(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
  }

  // HTTP methods
  public async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    return this.instance.get<T,T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T, T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T, T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T, T>(url, config);
  }


  private async refreshAuthToken(
    refreshToken: string
  ): Promise<{ accessToken: string; token: string }> {
    return this.instance.post("/refresh", null, {
      params: {
        refreshToken,
      },
    });
  }
}

const apiService = new ApiService();
export default apiService;
