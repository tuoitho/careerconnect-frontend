import apiService from "../api/apiService";

export const recruiterService = {
    getRecruiterProfile: async () => {
        return await apiService.get(`/recruiter/profile`);
    },
    updateRecruiterProfile: async (recruiterData) => {
        return await apiService.put(`/recruiter/profile`, recruiterData);
    },
}