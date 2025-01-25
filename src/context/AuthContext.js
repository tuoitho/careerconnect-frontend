import React, { createContext, useState } from "react";
import { authService } from "../api/authService";

// Tạo AuthContext
const AuthContext = createContext();

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedUser); // Kiểm tra nếu có user trong localStorage
  const login = async (userData) => {
      const resp = await authService.login(userData.username, userData.password);
      if (!resp) {
        return;
      }
      setUser(resp.username);
      setIsAuthenticated(true);      
      return resp;
  };
  

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user"); // Xóa thông tin khỏi localStorage
  };

  // Khi ứng dụng load, nếu có user trong localStorage, set lại state user và isAuthenticated
  //  useEffect(() => {
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export mặc định AuthContext
export default AuthContext;
