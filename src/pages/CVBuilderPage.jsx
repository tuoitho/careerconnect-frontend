import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import from the feature-cv structure including templates
import { CVBuilder, cvService, cvTemplatesWithRenderers } from '../features/feature-cv';
import LoadingSpinner from '../components/LoadingSpinner';

// Default CV structure
import { defaultCV, exampleCV } from '../features/feature-cv/defaultCV';
import { set } from 'date-fns';

const CVBuilderPage = () => {
  const { cvId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cv, setCV] = useState(null);
  const [templates, setTemplates] = useState([]);
  const loadCV = async () => {
    try {
      setLoading(true);
      if (cvId === 'new') {
        // Create a new CV with default structure
        setCV({ ...exampleCV });
      } else if (cvId) {
        // Load existing CV by ID
        const res= await cvService.fetchCV(cvId);
        setCV(JSON.parse(res.result.content));

    //     "result": {
    //     "id": 1,
    //     "name": "My CV",
    //     "content": "{\"personalInfo\":{\"fullName\":\"John Doe1\",\"title\":\"Full Stack Developer\",\"email\":\"john.doe@example.com\",\"phone\":\"+1 (555) 123-4567\",\"location\":\"San Francisco, CA\",\"website\":\"johndoe.dev\",\"summary\":\"Passionate full stack developer with 5+ years of experience building web applications with React, Node.js, and modern JavaScript. Committed to writing clean, maintainable code and creating intuitive user experiences.\"},\"experiences\":[{\"id\":\"exp1\",\"title\":\"Senior Frontend Developer\",\"company\":\"Tech Solutions Inc.\",\"location\":\"San Francisco, CA\",\"startDate\":\"01/2020\",\"endDate\":\"\",\"current\":true,\"description\":\"• Lead a team of 5 frontend developers\\n• Implemented modern React architecture with TypeScript\\n• Reduced bundle size by 40% and improved load times by 35%\\n• Collaborated with UX/UI designers to create responsive interfaces\"},{\"id\":\"exp2\",\"title\":\"Full Stack Developer\",\"company\":\"Digital Innovations\",\"location\":\"San Jose, CA\",\"startDate\":\"03/2017\",\"endDate\":\"12/2019\",\"current\":false,\"description\":\"• Developed RESTful APIs using Node.js and Express\\n• Built responsive web applications with React and Redux\\n• Implemented continuous integration and deployment pipelines\\n• Optimized database queries and improved application performance\"}],\"education\":[{\"id\":\"edu1\",\"degree\":\"Master of Science in Computer Science\",\"institution\":\"University of California\",\"location\":\"Berkeley, CA\",\"startDate\":\"08/2015\",\"endDate\":\"05/2017\",\"current\":false,\"description\":\"Focus on Software Engineering and AI. Relevant coursework: Advanced Algorithms, Machine Learning, Database Systems, Web Development.\"},{\"id\":\"edu2\",\"degree\":\"Bachelor of Science in Computer Science\",\"institution\":\"Stanford University\",\"location\":\"Stanford, CA\",\"startDate\":\"08/2011\",\"endDate\":\"05/2015\",\"current\":false,\"description\":\"Minor in Mathematics. Dean's List for 6 semesters.\"}],\"skills\":[\"JavaScript\",\"TypeScript\",\"React\",\"Node.js\",\"Express\",\"MongoDB\",\"SQL\",\"GraphQL\",\"Docker\",\"AWS\",\"Git\",\"CI/CD\",\"Jest\",\"Webpack\"]}",
    //     "templateId": null
    // }
    // parese thành obj giúp
    setCV(JSON.parse(res.result.content));
      } else {
        // Handle invalid cvId
        setCV(exampleCV);
      }
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
  useEffect(() => {
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