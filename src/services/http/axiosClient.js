import axios from 'axios';
import { LOCAL_STORAGE_KEYS } from '../../utils/constants';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com', // URL của API của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor để xử lý token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor để xử lý response
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;