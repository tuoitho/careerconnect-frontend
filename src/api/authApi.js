// authApi.js
import axios from 'axios';

const API_URL = 'https://reqres.in'; // Thay bằng URL API thực tế của bạn

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, credentials);
      return response; // Giả sử API trả về { user, token }
    } catch (error) {
      throw new Error('Login failed');
    }
  },
};
