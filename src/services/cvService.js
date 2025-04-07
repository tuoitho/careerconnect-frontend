import axios from 'axios';
import apiService from './apiService';

const CV_API_URL = `/cv`;
const CV_TEMPLATES_API_URL = `${CV_API_URL}/api/cv-templates`;

const cvService ={
  fetchUserCVs: async () => {
    try {
      const response = await apiService.get(CV_API_URL, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user CVs:', error);
      throw error;
    }
  },

  fetchCV: async (cvId) => {
    try {
      const response = await axios.get(`${CV_API_URL}/${cvId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching CV with ID ${cvId}:`, error);
      throw error;
    }
  },

  fetchDefaultCV : async () => {
    try {
      const response = await axios.get(`${CV_API_URL}/default`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching default CV:', error);
      throw error;
    }
  },

  createCV : async (cvData) => {
    try {
      const response = await axios.post(CV_API_URL, cvData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error;
    }
  },

  updateCV : async (cvId, cvData) => {
    try {
      const response = await axios.put(`${CV_API_URL}/${cvId}`, cvData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating CV with ID ${cvId}:`, error);
      throw error;
    }
  },

  deleteCV : async (cvId) => {
    try {
      await axios.delete(`${CV_API_URL}/${cvId}`, {
        withCredentials: true
      });
      return true;
    } catch (error) {
      console.error(`Error deleting CV with ID ${cvId}:`, error);
      throw error;
    }
  },

  fetchCVTemplates : async () => {
    try {
      const response = await axios.get(CV_TEMPLATES_API_URL, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching CV templates:', error);
      throw error;
    }
  },

  fetchCVTemplatesByCategory : async (category) => {
    try {
      const response = await axios.get(`${CV_TEMPLATES_API_URL}/category/${category}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching CV templates for category ${category}:`, error);
      throw error;
    }
  },

  fetchCVTemplate : async (templateId) => {
    try {
      const response = await axios.get(`${CV_TEMPLATES_API_URL}/${templateId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching CV template with ID ${templateId}:`, error);
      throw error;
    }
  }
}

export default cvService;