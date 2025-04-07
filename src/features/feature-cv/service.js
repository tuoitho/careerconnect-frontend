import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// CV Service functions
const cvService = {
  // Fetch all CVs for the current user
  fetchCVs: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cvs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching CVs:', error);
      throw error;
    }
  },

  // Fetch a single CV by ID
  fetchCV: async (cvId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cvs/${cvId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Parse content if it's a string
      if (response.data && typeof response.data.content === 'string') {
        try {
          response.data.content = JSON.parse(response.data.content);
        } catch (e) {
          console.error('Error parsing CV content:', e);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching CV:', error);
      throw error;
    }
  },

  // Create a new CV
  createCV: async (cvData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/cvs`, cvData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating CV:', error);
      throw error;
    }
  },

  // Update an existing CV
  updateCV: async (cvId, cvData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/cvs/${cvId}`, cvData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating CV:', error);
      throw error;
    }
  },

  // Delete a CV
  deleteCV: async (cvId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/cvs/${cvId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return true;
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  },

  // Set a CV as default
  setDefaultCV: async (cvId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/cvs/${cvId}/set-default`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error setting default CV:', error);
      throw error;
    }
  },

  // Fetch the user's default CV
  fetchDefaultCV: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cvs/default`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Parse content if it's a string
      if (response.data && typeof response.data.content === 'string') {
        try {
          response.data.content = JSON.parse(response.data.content);
        } catch (e) {
          console.error('Error parsing CV content:', e);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching default CV:', error);
      throw error;
    }
  },

  // Fetch CV templates
  fetchCVTemplates: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cv-templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching CV templates:', error);
      throw error;
    }
  },

  // Generate PDF from CV
  generatePDF: async (cvId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/cvs/${cvId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
};

export default cvService;