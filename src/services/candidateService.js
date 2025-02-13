import apiService from "../api/apiService";

export const candidateService = {
    getCandidatrProfile: async () => {
        return await apiService.get(`/candidate/myprofile`);
    },
    updateCandidatProfile: async (candidateProfile) => {
        return await apiService.put(`/candidate/myprofile`, candidateProfile,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    },
    uploadCV: async (formData) => {
        return await apiService.post(`/candidate/upload-cv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    deleteCV: async (cvId) => {
        return await apiService.delete(`/candidate/upload-cv/${cvId}`);
    },
}