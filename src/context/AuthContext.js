import React, { createContext, useState, useContext } from 'react';
import { authApi } from '../api/authApi'; // Import authApi vào đây

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    console.log('Login successful:', response);
    // setUser(response); // Lưu user vào state sau khi đăng nhập thành công
    localStorage.setItem('user', JSON.stringify(response));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  console.log('Current user2:', user); // Kiểm tra xem user có đúng không

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
