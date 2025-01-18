// apiService.js
import axios from 'axios';

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://reqres.in',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: new Date() };
        
        // Kiểm tra nếu endpoint không yêu cầu Authorization
        const excludedEndpoints = ['/auth/login'];
        if (!excludedEndpoints.includes(config.url)) {
          const token = localStorage.getItem('authToken');
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
        console.log('Response error:', error.response?.data);
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await this.refreshAuthToken(refreshToken);
            
            localStorage.setItem('authToken', response.token);
            originalRequest.headers.Authorization = `Bearer ${response.token}`;
            
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.clearAuthToken();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  clearAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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

  async refreshAuthToken(refreshToken) {
    return this.instance.post('/auth/refresh', { refreshToken });
  }
}

const apiService = new ApiService();
export default apiService;