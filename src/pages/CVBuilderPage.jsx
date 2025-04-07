import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import from the feature-cv structure including templates
import { CVBuilder, cvService, cvTemplatesWithRenderers } from '../features/feature-cv';
import LoadingSpinner from '../components/LoadingSpinner';

// Default CV structure
import { defaultCV, exampleCV } from '../features/feature-cv/defaultCV';

const CVBuilderPage = () => {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const loadCV = async () => {
      try {
        setLoading(true);
        let cvData;
        
        if (cvId === 'new') {
          // Create a new CV with default structure
          cvData = { ...exampleCV };
        } else if (cvId) {
          // Load existing CV by ID
          cvData = await cvService.fetchCV(cvId);
        } else {

        }
        
        setCV(exampleCV);
        
        // Load templates
        try {
          // const templatesData = await cvService.fetchCVTemplates();
          // Use the templates from our feature-cv directory
          const templatesData = cvTemplatesWithRenderers;
          if (templatesData && templatesData.length > 0) {
            setTemplates(templatesData);
          } else {
            // Fallback to default templates if needed
            setTemplates(cvTemplatesWithRenderers);
          }
        } catch (error) {
          console.error('Error loading templates:', error);
          // Use templates from feature-cv on error
          setTemplates(cvTemplatesWithRenderers);
        }
      } catch (error) {
        console.error('Error loading CV:', error);
        toast.error('Failed to load CV. Please try again.');
        navigate('/cvs');
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, [cvId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">CV Builder</h1>
      {cv && (
        <CVBuilder 
          initialCV={cv} 
          templates={templates}
          existingCVId={cvId !== 'new' ? cvId : null}
        />
      )}
    </div>
  );
};

export default CVBuilderPage;