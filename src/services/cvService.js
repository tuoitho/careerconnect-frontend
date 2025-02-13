
import apiService from "../api/apiService";

export const cvService = {
    getUserCVs: async () => 
        await apiService.get(`/candidate/profile/cv`),
}