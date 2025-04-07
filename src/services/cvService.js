import apiService from './apiService';

// CV Service functions
const cvService = {
  // Fetch all CVs for the current user
  fetchCVs: async () => {
    try {
      const response = await apiService.get(`/cvs`)
      return response;
    } catch (error) {
      console.error('Error fetching CVs:', error);
      throw error;
    }
  },

  // Fetch a single CV by ID
  fetchCV: async (cvId) => {
    try {
      const response = await apiService.get(`/cvs/${cvId}`);
      return response;
    } catch (error) {
      console.error('Error fetching CV:', error);
      throw error;
    }
  },

  // Create a new CV
  createCV: async (cvData) => {
    try {
      const response = await apiService.post(`/cvs`, cvData);
      return response;
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error;
    }
  },

  // Update an existing CV
  updateCV: async (cvId, cvData) => {
    try {
      const response = await apiService.put(`/cvs/${cvId}`, cvData);
      return response;
    } catch (error) {
      console.error('Error updating CV:', error);
      throw error;
    }
  },

  // Delete a CV
  deleteCV: async (cvId) => {
    try {
      const resp = await apiService.delete(`/cvs/${cvId}`);
      return resp;
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  },

  // Set a CV as default
  setDefaultCV: async (cvId) => {
    try {
      const response = await apiService.put(`/cvs/${cvId}/set-default`);
      return response;
    } catch (error) {
      console.error('Error setting default CV:', error);
      throw error;
    }
  },

  // Fetch the user's default CV
  fetchDefaultCV: async () => {
    try {
      const response = await apiService.get(`/cvs/default`);
      return response;
    } catch (error) {
      console.error('Error fetching default CV:', error);
      throw error;
    }
  },

  // Fetch CV templates
  fetchCVTemplates: async () => {
    try {
      const response = await apiService.get(`/cv-templates`);
      return response;
    } catch (error) {
      console.error('Error fetching CV templates:', error);
      throw error;
    }
  },

  // Generate PDF from CV
  generatePDF: async (cvId) => {
    try {
      const response = await apiService.get(`/cvs/${cvId}/pdf`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
};

export default cvService;