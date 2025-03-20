import React, { createContext, useState } from "react";
import { useAuthService } from "../api/authServiceWithHook";
import Loading2 from "../components/Loading2";

// Tạo AuthContext
const AuthContextWithHook = createContext();

// Tạo Provider sử dụng hook useAuthService
export const AuthProviderWithHook = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("user");
  });
  
  // Sử dụng hook useAuthService
  const authService = useAuthService();
  
  const login = async (userData, tk) => {
    try {
      // Sử dụng execute từ hook
      const response = await authService.login.execute(userData.username, userData.password, tk);
      setUser(response.user);
      setIsAuthenticated(true);      
      localStorage.setItem("user", JSON.stringify(response.user)); 
      localStorage.setItem('authToken', response.accessToken);
      return response;
    }
    catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      // Sử dụng execute từ hook
      await authService.logout.execute();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem('authToken');
    } catch (error) {
      // Không cần xử lý lỗi ở đây vì đã được xử lý trong hook
    }
  };

  return (
    <AuthContextWithHook.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        login, 
        logout,
        loading: authService.login.loading || authService.logout.loading,
        error: authService.login.error || authService.logout.error
      }}
    >
      {children}
      {(authService.login.loading || authService.logout.loading) && <Loading2 />}
    </AuthContextWithHook.Provider>
  );
};

// Export mặc định AuthContext
export default AuthContextWithHook;