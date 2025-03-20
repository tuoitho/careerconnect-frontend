import { useContext, useCallback } from 'react';
import AuthContext from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook để xử lý authentication
 * @returns {Object} - Các phương thức và state liên quan đến authentication
 */
export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hàm đăng nhập và điều hướng
  const loginWithRedirect = useCallback(async (userData, tk, redirectPath = '/') => {
    try {
      const response = await login(userData, tk);
      navigate(redirectPath);
      return response;
    } catch (error) {
      throw error;
    }
  }, [login, navigate]);

  // Hàm đăng xuất và điều hướng
  const logoutWithRedirect = useCallback(async (redirectPath = '/login') => {
    try {
      await logout();
      navigate(redirectPath);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [logout, navigate]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    loginWithRedirect,
    logoutWithRedirect,
    // Kiểm tra vai trò người dùng
    isRecruiter: user?.role === 'RECRUITER',
    isCandidate: user?.role === 'CANDIDATE',
    isAdmin: user?.role === 'ADMIN',
  };
};