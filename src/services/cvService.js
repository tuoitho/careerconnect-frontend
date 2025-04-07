import apiService from "./apiService";

const BASE_URL = "/cv";

const cvService = {
  // Get all CVs for the current user
  getAllCVs: async () => {
    const response = await apiService.get(`${BASE_URL}`);
    return response;
  },

  // Get a specific CV by ID
  getCV: async (cvId) => {
    const response = await apiService.get(`${BASE_URL}/${cvId}`);
    return response;
  },

  // Get the current CV
  getCurrentCV: async () => {
    const response = await apiService.get(`${BASE_URL}/current`);
    return response;
  },

  // Create a new CV
  createCV: async (cvData) => {
    const response = await apiService.post(`${BASE_URL}`, cvData);
    return response;
  },

  // Update an existing CV
  updateCV: async (cvId, cvData) => {
    const response = await apiService.put(`${BASE_URL}/${cvId}`, cvData);
    return response;
  },

  // Delete a CV
  deleteCV: async (cvId) => {
    const response = await apiService.delete(`${BASE_URL}/${cvId}`);
    return response;
  },

  // Get all CV templates
  getAllTemplates: async () => {
    console.log("Fetching all CV templates...");
    const response = await apiService.get(`${BASE_URL}/templates`);
    return response;
  },

  // Get a specific CV template by ID
  getTemplateById: async (templateId) => {
    const response = await apiService.get(`${BASE_URL}/templates/${templateId}`);
    return response;
  },

  // Get CV templates by category
  getTemplatesByCategory: async (category) => {
    const response = await apiService.get(`${BASE_URL}/templates/category/${category}`);
    return response;
  },

  // Download CV as PDF (returns a URL to be used for downloading)
  downloadCVAsPdf: (cvId) => {
    return `${apiService.getBaseUrl()}${BASE_URL}/${cvId}/pdf`;
  }
};

export default cvService;
