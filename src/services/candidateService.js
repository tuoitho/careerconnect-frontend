import apiService from "../api/apiService";

export const candidateService = {
    getCandidatrProfile: async () => {
        return await apiService.get(`/candidate/profile`);
    },
    updateCandidatProfile: async (candidateProfile) => {
        return await apiService.put(`/candidate/profile`, candidateProfile);
    },
}