import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cvService from "../services/cvService";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import defaultCVTemplates from "../data/defaultCVTemplates";

const MyCVsPage = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        setLoading(true);
        // const cvsData = await cvService.fetchUserCVs();
        // setCvs(cvsData.result);
        
        // Load templates for "Create New CV" section
        // const templatesData = await cvService.getAllTemplates();
        // setTemplates(templatesData.result);
        setTemplates(defaultCVTemplates)
      } catch (error) {
        console.error("Error fetching CVs:", error);
        toast.error("Failed to load your CVs");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCVs();
  }, []);

  const handleDelete = async (cvId) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      try {
        setLoading(true);
        await cvService.deleteCV(cvId);
        setCvs(cvs.filter(cv => cv.cvId !== cvId));
        toast.success("CV deleted successfully");
      } catch (error) {
        console.error("Error deleting CV:", error);
        toast.error("Failed to delete CV");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMakeCurrent = async (cvId) => {
    try {
      setLoading(true);
      await cvService.updateCV(cvId, { isCurrent: true });
      
      // Update the local state to reflect the change
      setCvs(cvs.map(cv => ({
        ...cv,
        isCurrent: cv.cvId === cvId
      })));
      
      toast.success("CV set as current");
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Failed to update CV");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (cvId, cvName) => {
    try {
      const pdfUrl = cvService.downloadCVAsPdf(cvId);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', `${cvName || 'cv'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Failed to download CV");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My CVs</h1>
        <p className="text-gray-600">Manage your professional CVs and create new ones</p>
      </div>

      {/* Create New CV Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create a New CV</h2>
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            {showTemplates ? "Hide Templates" : "Show Templates"}
          </button>
        </div>
        
        {showTemplates ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/candidate/cv-builder/template/${template.id}`)}
              >
                <div className="h-36 bg-gray-100 flex items-center justify-center">
                  {template.thumbnailUrl ? (
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No preview</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-6 rounded-lg">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-semibold text-blue-800 mb-1">Start Building Your Professional CV</h3>
              <p className="text-blue-600">Choose from our professional templates or create a custom CV</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Choose Template
              </button>
              <Link
                to="/candidate/cv-builder"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-center"
              >
                Start from Scratch
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Existing CVs Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Your Existing CVs</h2>
        </div>
        
        {cvs.length > 0 ? (
          <div className="divide-y">
            {cvs.map(cv => (
              <div key={cv.cvId} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">{cv.name || "Untitled CV"}</h3>
                    {cv.isCurrent && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                  </div>
                  {cv.template && (
                    <div className="text-sm text-gray-500">
                      Template: {cv.template.name}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/candidate/cv-builder/${cv.cvId}`}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDownload(cv.cvId, cv.name)}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Download
                  </button>
                  {!cv.isCurrent && (
                    <button
                      onClick={() => handleMakeCurrent(cv.cvId)}
                      className="px-3 py-1.5 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50"
                    >
                      Make Current
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(cv.cvId)}
                    className="px-3 py-1.5 border border-red-600 text-red-600 text-sm rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p className="mb-4">You don't have any CVs yet.</p>
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First CV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCVsPage;