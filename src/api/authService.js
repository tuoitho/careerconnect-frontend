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
      
      // Lưu tokens
      apiService.setAuthToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      toast.success('Đăng nhập thành công!');
      return response;
    } catch (error) {
      toast.error('Đăng nhập thất bại: ' + error.message);
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
