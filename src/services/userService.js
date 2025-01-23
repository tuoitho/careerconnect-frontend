import axios from "axios";
import apiService from "../api/apiService";
import { toast } from "react-toastify";

export const registerUser = async (userData) => {
  try {
    const response = await apiService.post(`/auth/register`, userData);
    return response;
  } catch (error) {
    toast.error("Lỗi tai registerUser:", error.message);
  }
};
