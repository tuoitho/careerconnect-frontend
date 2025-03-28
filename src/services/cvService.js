
import apiService from "./apiService.js";

export const cvService = {
    getUserCVs: async () =>
        await apiService.get(`/candidate/profile/cv`),
}
