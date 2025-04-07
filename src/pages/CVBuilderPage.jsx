import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import cvService from "../services/cvService";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import CVTemplateSelector from "../components/cv/CVTemplateSelector";
import CVEditor from "../components/cv/CVEditor";
import CVPreview from "../components/cv/CVPreview";

const CVBuilderPage = () => {
  const { cvId, templateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [cv, setCV] = useState(null);
  const [step, setStep] = useState(cvId ? 2 : 1); // 1: Template Selection, 2: Editor, 3: Preview
  const [cvData, setCVData] = useState({
    name: "",
    jsonData: "",
    templateId: null
  });

  useEffect(() => {
    const initializeCV = async () => {
      try {
        setLoading(true);
        
        // Load templates
        const templatesData = await cvService.getAllTemplates();
        setTemplates(templatesData);
        
        // If editing existing CV
        if (cvId) {
          const cvData = await cvService.getCV(cvId);
          setCV(cvData);
          setCVData({
            name: cvData.name,
            jsonData: cvData.jsonData,
            templateId: cvData.template?.templateId
          });
          
          if (cvData.template) {
            setSelectedTemplate(cvData.template);
          }
          
          setStep(2); // Go directly to editor for existing CV
        } 
        // If creating from template
        else if (templateId) {
          const template = await cvService.getTemplateById(templateId);
          setSelectedTemplate(template);
          setCVData(prev => ({
            ...prev,
            templateId: template.templateId,
            jsonData: template.schemaTemplate || createEmptyCV(template.name)
          }));
          setStep(2); // Go directly to editor when template is selected
        }
      } catch (error) {
        console.error("Error initializing CV:", error);
        toast.error("Failed to load CV data");
      } finally {
        setLoading(false);
      }
    };
    
    initializeCV();
  }, [cvId, templateId]);

  // Create a blank CV structure for new CVs
  const createEmptyCV = (templateName) => {
    return JSON.stringify({
      templateId: templateId,
      sections: {
        personal_info: {
          position: { x: 40, y: 750 },
          content: {
            name: "Your Name",
            email: "your.email@example.com",
            phone: "Your Phone Number",
            location: "Your Location"
          },
          style: {
            fontFamily: "Arial",
            fontSize: "14px",
            color: "#333333"
          }
        },
        summary: {
          position: { x: 40, y: 700 },
          title: "Professional Summary",
          content: "Write a professional summary here...",
          style: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#555555"
          }
        }
      },
      metadata: {
        templateName: templateName || "Basic",
        createdAt: new Date().toISOString(),
        version: 1.0
      }
    });
  };
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCVData(prev => ({
      ...prev,
      templateId: template.templateId,
      jsonData: template.schemaTemplate || createEmptyCV(template.name)
    }));
    setStep(2);
  };

  const handleSaveCV = async () => {
    try {
      setLoading(true);
      
      if (cvId) {
        // Update existing CV
        await cvService.updateCV(cvId, {
          name: cvData.name,
          jsonData: cvData.jsonData
        });
        toast.success("CV updated successfully");
      } else {
        // Create new CV
        const response = await cvService.createCV({
          name: cvData.name,
          templateId: cvData.templateId,
          jsonData: cvData.jsonData
        });
        
        // Navigate to edit page for the new CV
        navigate(`/cv-builder/${response.cvId}`);
        toast.success("CV created successfully");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      toast.error("Failed to save CV");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cvId) {
      toast.warning("Please save your CV first before downloading");
      return;
    }
    
    try {
      const pdfUrl = cvService.downloadCVAsPdf(cvId);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${cvData.name || 'cv'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {cvId ? "Edit Your CV" : "Create a New CV"}
        </h1>
        <div className="flex items-center space-x-4">
          <div 
            className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 1 ? "border-blue-600 bg-blue-100" : "border-gray-300"}`}>
              1
            </div>
            <span className="ml-2">Choose Template</span>
          </div>
          <div className="h-px w-12 bg-gray-300"></div>
          <div 
            className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 2 ? "border-blue-600 bg-blue-100" : "border-gray-300"}`}>
              2
            </div>
            <span className="ml-2">Edit Content</span>
          </div>
          <div className="h-px w-12 bg-gray-300"></div>
          <div 
            className={`flex items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}
          >
            <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${step >= 3 ? "border-blue-600 bg-blue-100" : "border-gray-300"}`}>
              3
            </div>
            <span className="ml-2">Preview & Download</span>
          </div>
        </div>
      </div>

      {step === 1 && (
        <CVTemplateSelector 
          templates={templates} 
          onSelect={handleTemplateSelect}
        />
      )}

      {step === 2 && (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2">
            <CVEditor 
              cvData={cvData} 
              setCVData={setCVData} 
              onSave={handleSaveCV} 
              onPreview={() => setStep(3)}
            />
          </div>
          <div className="lg:w-1/2">
            <CVPreview jsonData={cvData.jsonData} template={selectedTemplate} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center">
          <CVPreview 
            jsonData={cvData.jsonData} 
            template={selectedTemplate}
            fullPreview={true}
          />
          <div className="mt-6 flex space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => setStep(2)}
            >
              Back to Editor
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={handleSaveCV}
            >
              Save CV
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilderPage;