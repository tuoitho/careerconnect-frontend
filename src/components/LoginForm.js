import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

import { authService } from '../api/authService';

const LoginForm = () => {
  // const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await authService.login(credentials.username, credentials.password);
    console.log('User:', user);
    try {
      // await login(credentials); 

      // const response = await axiosInstance.post('/api/login', credentials);
      // console.log('Login successful:', response.data);
      // Xử lý logic sau khi đăng nhập thành công ở đây
    } catch (error) {
      console.error('Login failed:', error);
      // Xử lý logic khi đăng nhập thất bại ở đây
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
