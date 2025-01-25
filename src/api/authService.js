import apiService from './apiService';
import { toast } from 'react-toastify';

export const authService = {
  // Đăng nhập
  async login(username, password) {
    try {
      const response = await apiService.post('/auth/login', {
        username,
        password
      });
      if (!response) {
        throw new Error('Login failed: Invalid response from <server>')
      }
      // Lưu tokens
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      toast.success('Đăng nhập thành công!');
      return response;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      console.error('err in login:', error);
      // throw error;
    }
  },

  // Đăng xuất
  async logout() {
    try {
      await apiService.post('/auth/logout');
      apiService.clearAuthToken();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn xóa tokens ở client side ngay cả khi API fails
      apiService.clearAuthToken();
    }
  }
};
