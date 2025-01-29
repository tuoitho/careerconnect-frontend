import apiService from './apiService';
import { toast } from 'react-toastify';

interface LoginResponse {
  username: string;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  // Đăng nhập
  async login(username: string, password: string): Promise<LoginResponse | null> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', { username, password });

      if (!response) {
        throw new Error('Login failed: Invalid response from server');
      }

      // Lưu tokens
      localStorage.setItem('user', response.username);
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      toast.success('Đăng nhập thành công!');
      return response;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      console.error('Error in login:', error);
      return null;
    }
  },

  // Đăng xuất
  async logout(): Promise<boolean> {
    try {
      await apiService.post('/auth/logout');
      apiService.clearAuthToken();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn xóa tokens ở client side ngay cả khi API thất bại
      apiService.clearAuthToken();
      return false;
    }
  }
};
