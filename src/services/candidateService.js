import apiService from "../api/apiService";

export const candidateService = {
    getCandidatrProfile: async () => {
        return await apiService.get(`/candidate/profile/me`);
    },
    getCandidateDetail: async (candidateId) => {
        return await apiService.get(`/candidate/profile/${candidateId}`);
    },
    updateCandidatProfile: async (candidateProfile) => {
        return await apiService.put(`/candidate/profile/me`, candidateProfile,
            {
                headers: {
                    'Content-Type': 'application/multipart/form-data'   
                } 
            }
        );
    },
    uploadCV: async (formData) => {
        return await apiService.post(`/candidate/profile/cv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    deleteCV: async (cvId) => {
        return await apiService.delete(`/candidate/profile/cv/${cvId}`);
    },
}