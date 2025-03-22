import React, { createContext, useState } from "react";
import { authService } from "../api/authService";
import { toast } from "react-toastify";
import { tr } from "date-fns/locale";
import { set } from "date-fns";
import { Loader2 } from "lucide-react";
import Loading2 from "../components/Loading2";

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
  const [loading, setLoading] = useState(false);
   const login = async (userData, tk) => {
    try {
      console.log("start login");
      const response = await authService.login(userData.username, userData.password,tk);
      console.log(response);
      console.log("end login");
      setUser(response.user);
      setIsAuthenticated(true);      
      localStorage.setItem("user", JSON.stringify(response.user)); 
      localStorage.setItem('authToken', response.accessToken);
      return response;
    }
    catch (error) {
      //tiếp tục throw error để component gọi hàm này xử lý
      console.log(error);
      throw error;
    }
  };
  

  const logout = async () => {
    try {
      setLoading(true);
      const response = await authService.logout();
      console.log(response);
      toast.success(response.message);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      localStorage.removeItem('authToken');
    } catch (error) {
      toast.error(error.response.message);
    } finally {
      setLoading(false);
    }

  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
      {loading && <Loading2 />}
    </AuthContext.Provider>
  );
};

// Export mặc định AuthContext
export default AuthContext;
