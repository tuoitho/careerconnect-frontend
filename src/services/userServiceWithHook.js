import { useApi } from '../hooks/useApi';
import apiService from '../api/apiService';

export const useUserService = () => {
  // Đăng ký tài khoản
  const registerApi = useApi(
    async (userData) => await apiService.post('/auth/register', userData),
    { showSuccessToast: true }
  );

  // Lấy thông tin người dùng hiện tại
  const getCurrentUserApi = useApi(
    async () => await apiService.get('/user/me'),
    { showSuccessToast: false }
  );

  // Cập nhật thông tin người dùng
  const updateUserApi = useApi(
    async (userData) => await apiService.put('/user/me', userData),
    { showSuccessToast: true }
  );

  // Đổi mật khẩu
  const changePasswordApi = useApi(
    async (passwordData) => await apiService.post('/user/change-password', passwordData),
    { showSuccessToast: true }
  );

  // Quên mật khẩu
  const forgotPasswordApi = useApi(
    async (email) => await apiService.post('/auth/forgot-password', { email }),
    { showSuccessToast: true }
  );

  // Đặt lại mật khẩu
  const resetPasswordApi = useApi(
    async (resetData) => await apiService.post('/auth/reset-password', resetData),
    { showSuccessToast: true }
  );

  return {
    register: registerApi,
    getCurrentUser: getCurrentUserApi,
    updateUser: updateUserApi,
    changePassword: changePasswordApi,
    forgotPassword: forgotPasswordApi,
    resetPassword: resetPasswordApi
  };
};