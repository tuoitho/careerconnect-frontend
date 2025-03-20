import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook để xử lý API requests
 * @param {Function} apiFunction - Hàm gọi API
 * @param {Object} options - Các tùy chọn
 * @returns {Object} - Các phương thức và state để xử lý API request
 */
export const useApi = (apiFunction, options = {}) => {
  const { onSuccess, onError, showSuccessToast = true, showErrorToast = true } = options;
  
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction(...args);
      setData(response);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      if (showSuccessToast && response.message) {
        toast.success(response.message);
      }
      
      return response;
    } catch (err) {
      setError(err);
      
      if (onError) {
        onError(err);
      }
      
      if (showErrorToast) {
        const errorMessage = err.response?.data?.message || err.message || 'Đã xảy ra lỗi';
        toast.error(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showSuccessToast, showErrorToast]);

  return {
    data,
    error,
    loading,
    execute,
    setData,
    reset: () => {
      setData(null);
      setError(null);
      setLoading(false);
    },
  };
};