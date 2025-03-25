import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../authSlice';

/**
 * Custom hook để xử lý authentication
 * @returns {Object} - Các phương thức và state liên quan đến authentication
 */
export const useAuth = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm đăng nhập và điều hướng
  const loginWithRedirect = useCallback(async (userData, tk, redirectPath = '/') => {
    try {
      const response = await dispatch(loginAction({ userData, tk })).unwrap();
      navigate(redirectPath);
      return response;
    } catch (error) {
      throw error;
    }
  }, [dispatch, navigate]);

  // Hàm đăng xuất và điều hướng
  const logoutWithRedirect = useCallback(async (redirectPath = '/login') => {
    try {
      await dispatch(logoutAction()).unwrap();
      navigate(redirectPath);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [dispatch, navigate]);

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