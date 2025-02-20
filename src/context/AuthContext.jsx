import React, { createContext, useState } from "react";
import { authService } from "../api/authService";
import { toast } from "react-toastify";

// Tạo AuthContext
const AuthContext = createContext();

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("user");
  });
   const login = async (userData, tk) => {
    try {
      const response = await authService.login(userData.username, userData.password,tk);
      setUser(response.user);
      setIsAuthenticated(true);      
      localStorage.setItem("user", JSON.stringify(response.user)); 
      localStorage.setItem('authToken', response.accessToken);
      return response;
    }
    catch (error) {
      //tiếp tục throw error để component gọi hàm này xử lý
      throw error;
    }
  };
  

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem('authToken');
    toast.success("Đăng xuất thành công");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export mặc định AuthContext
export default AuthContext;
