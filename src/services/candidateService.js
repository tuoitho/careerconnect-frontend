import apiService from "../api/apiService";

export const candidateService = {
    getCandidatrProfile: async () => {
        return await apiService.get(`/candidate/profile`);
    },
    updateCandidatProfile: async (candidateProfile) => {
        return await apiService.put(`/candidate/profile`, candidateProfile,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    },
    uploadCV: async (formData) => {
        return await apiService.post(`/candidate/profile/upload-cv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    deleteCV: async (cvId) => {
        return await apiService.delete(`/candidate/profile/delete-cv/${cvId}`);
    },
}