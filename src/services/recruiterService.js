import apiService from "./apiService.js";

export const recruiterService = {
    getRecruiterProfile: async () => {
        return await apiService.get(`/recruiter/profile`);
    },
    updateRecruiterProfile: async (recruiterData) => {
        return await apiService.put(`/recruiter/profile`, recruiterData);
    },
}
