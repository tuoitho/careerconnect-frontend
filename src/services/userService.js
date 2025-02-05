import axios from "axios";
import apiService from "../api/apiService";
import { toast } from "react-toastify";

export const registerUser = async (userData) => {
    return await apiService.post(`/auth/register`, userData);
};
