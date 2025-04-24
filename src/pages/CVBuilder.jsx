import React, { useState, useEffect } from 'react';
import CVEditor from '../components/cv-builder/CVEditor';
import CVPreview from '../components/cv-builder/CVPreview';
import TemplateSelector from '../components/cv-builder/TemplateSelector';
import cvService from '../services/cvService';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { defaultCV } from '../data/defaultCV';

const CVBuilder = () => {
  // Initialize with defaultCV to prevent null errors
  const [cv, setCV] = useState(defaultCV);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const { cvId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCV = async () => {
      try {
        setLoading(true);
        
        if (cvId) {
          // If cvId exists, fetch the existing CV from API
          const response = await cvService.fetchCV(cvId);
          console.log('CV response:', response);
          if (response.result) {
            // Parse the content string back to an object
            let cvContent;
            try {
              // If content is already a string, parse it
              if (typeof response.result.content === 'string') {
                cvContent = JSON.parse(response.result.content);
              } else {
                // If content is already an object, use it directly
                cvContent = response.result.content;
              }
              
              // Make sure we have valid CV data
              if (cvContent && typeof cvContent === 'object') {
                setCV(cvContent);
                setSelectedTemplate(response.result.templateId || 'modern');
                toast.success('CV loaded successfully');
              } else {
                console.error('Invalid CV content format');
                toast.error('CV format is invalid');
                // Fall back to default CV
                setCV(defaultCV);
              }
            } catch (error) {
              console.error('Error parsing CV content:', error);
              toast.error('CV format is invalid');
              // Fall back to default CV
              setCV(defaultCV);
            }
          } else {
            // If no result, use default CV
            setCV(defaultCV);
          }
        } else {
          // If creating a new CV, use the sample data from defaultCV.js
          setCV(defaultCV);
        }
      } catch (error) {
        console.error('Error loading CV:', error);
        toast.error('Failed to load CV data');
        // Fall back to default CV on error
        setCV(defaultCV);
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, [cvId, navigate]);

  const handleCVUpdate = (newData) => {
    setCV(newData);
  };

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        {cvId ? 'Edit CV' : 'Create New CV'}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <CVEditor cv={cv} onUpdate={handleCVUpdate} cvId={cvId} templateId={selectedTemplate} />
          </div>
          <div className="lg:col-span-8">
            <div className="mb-6">
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={handleTemplateChange}
              />
            </div>
            <CVPreview cv={cv} template={selectedTemplate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;