import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://reqres.in', // Replace with your actual base URL
  headers: {
    'Content-Type': 'application/json',
    // Add other default headers here
  },
});

// Add a request interceptor to include any additional headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify config to add headers if needed
    // For example, add an authorization token
    // config.headers.Authorization = `Bearer ${yourToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
