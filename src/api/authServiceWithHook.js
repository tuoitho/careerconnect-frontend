import { useApi } from '../hooks/useApi';
import apiService from './apiService';

export const useAuthService = () => {
  // Login API
  const loginApi = useApi(
    async (username, password, tk) => {
      return await apiService.post(
        '/auth/login',
        { username, password },
        {
          params: { tk },
          withCredentials: true,
        }
      );
    },
    { showSuccessToast: true }
  );

  // Logout API
  const logoutApi = useApi(
    async () => {
      try {
        return await apiService.post('/auth/logout', {}, { withCredentials: true });
      } catch (error) {
        apiService.clearAuthToken();
        throw error;
      } finally {
        apiService.clearAuthToken();
      }
    },
    { showSuccessToast: true }
  );

  // Refresh token API
  const refreshTokenApi = useApi(
    async () => {
      return await apiService.post('/auth/refresh-token', {}, { withCredentials: true });
    },
    { showSuccessToast: false, showErrorToast: false }
  );

  return {
    login: loginApi,
    logout: logoutApi,
    refreshToken: refreshTokenApi,
  };
};