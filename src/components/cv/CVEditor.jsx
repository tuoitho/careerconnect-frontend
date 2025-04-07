import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const CVEditor = ({ cvData, setCVData, onSave, onPreview }) => {
  const [parsedData, setParsedData] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [name, setName] = useState(cvData.name || "");
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (cvData.jsonData) {
        const data = typeof cvData.jsonData === 'string' 
          ? JSON.parse(cvData.jsonData) 
          : cvData.jsonData;
        setParsedData(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error parsing CV data:", error);
      setError("Invalid CV data format");
    }
  }, [cvData.jsonData]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setCVData({
      ...cvData,
      name: e.target.value
    });
  };

  const handleSectionEdit = (sectionKey) => {
    setEditingSection(sectionKey);
  };

  const handleSectionChange = (sectionKey, updatedContent) => {
    if (!parsedData || !parsedData.sections) return;
    
    const updatedData = {
      ...parsedData,
      sections: {
        ...parsedData.sections,
        [sectionKey]: {
          ...parsedData.sections[sectionKey],
          content: updatedContent
        }
      }
    };
    
    setParsedData(updatedData);
    setCVData({
      ...cvData,
      jsonData: JSON.stringify(updatedData)
    });
  };

  const handleAddSection = () => {
    if (!parsedData) return;
    
    const newSectionKey = `section_${Date.now()}`;
    const updatedData = {
      ...parsedData,
      sections: {
        ...parsedData.sections,
        [newSectionKey]: {
          title: "New Section",
          position: { x: 40, y: 400 },
          content: "",
          style: {
            fontFamily: "Arial",
            fontSize: "12px",
            color: "#333333"
          }
        }
      }
    };
    
    setParsedData(updatedData);
    setCVData({
      ...cvData,
      jsonData: JSON.stringify(updatedData)
    });
    setEditingSection(newSectionKey);
  };

  const handleSectionDelete = (sectionKey) => {
    if (!parsedData || !parsedData.sections) return;

    // Don't allow deletion of required sections like personal_info
    if (sectionKey === 'personal_info') {
      toast.warn("Cannot delete personal information section");
      return;
    }
    
    const { [sectionKey]: deletedSection, ...remainingSections } = parsedData.sections;
    
    const updatedData = {
      ...parsedData,
      sections: remainingSections
    };
    
    setParsedData(updatedData);
    setCVData({
      ...cvData,
      jsonData: JSON.stringify(updatedData)
    });
    
    if (editingSection === sectionKey) {
      setEditingSection(null);
    }
  };

  const renderEditableField = (fieldKey, fieldValue, sectionKey) => {
    return (
      <div key={fieldKey} className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {fieldKey.replace(/_/g, ' ')}
        </label>
        {fieldKey === 'name' ? (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => {
              const updatedContent = {
                ...parsedData.sections[sectionKey].content,
                [fieldKey]: e.target.value
              };
              handleSectionChange(sectionKey, updatedContent);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <input
            type="text"
            value={fieldValue}
            onChange={(e) => {
              const updatedContent = {
                ...parsedData.sections[sectionKey].content,
                [fieldKey]: e.target.value
              };
              handleSectionChange(sectionKey, updatedContent);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    );
  };

  const renderSectionEditor = (sectionKey) => {
    const section = parsedData.sections[sectionKey];
    
    if (!section) return null;
    
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{section.title || sectionKey}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingSection(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              Done
            </button>
            {sectionKey !== 'personal_info' && (
              <button
                onClick={() => handleSectionDelete(sectionKey)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        
        {typeof section.content === 'string' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={section.content}
              onChange={(e) => handleSectionChange(sectionKey, e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <div>
            {Object.entries(section.content || {}).map(([fieldKey, fieldValue]) => 
              renderEditableField(fieldKey, fieldValue, sectionKey)
            )}
          </div>
        )}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Position</h4>
          <div className="flex space-x-4">
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">X Position</label>
              <input
                type="number"
                value={section.position?.x || 0}
                onChange={(e) => {
                  const updatedData = {
                    ...parsedData,
                    sections: {
                      ...parsedData.sections,
                      [sectionKey]: {
                        ...section,
                        position: {
                          ...section.position,
                          x: parseInt(e.target.value, 10)
                        }
                      }
                    }
                  };
                  setParsedData(updatedData);
                  setCVData({
                    ...cvData,
                    jsonData: JSON.stringify(updatedData)
                  });
                }}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Y Position</label>
              <input
                type="number"
                value={section.position?.y || 0}
                onChange={(e) => {
                  const updatedData = {
                    ...parsedData,
                    sections: {
                      ...parsedData.sections,
                      [sectionKey]: {
                        ...section,
                        position: {
                          ...section.position,
                          y: parseInt(e.target.value, 10)
                        }
                      }
                    }
                  };
                  setParsedData(updatedData);
                  setCVData({
                    ...cvData,
                    jsonData: JSON.stringify(updatedData)
                  });
                }}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p className="font-semibold">Error editing CV</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-md">
        <div className="text-gray-400">Loading CV editor...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CV Name
        </label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter a name for your CV"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {editingSection ? (
        // Section editor view
        renderSectionEditor(editingSection)
      ) : (
        // Sections list view
        <div>
          <h3 className="text-lg font-semibold mb-4">CV Sections</h3>
          <div className="space-y-3">
            {parsedData.sections && Object.keys(parsedData.sections).map((sectionKey) => {
              const section = parsedData.sections[sectionKey];
              return (
                <div 
                  key={sectionKey}
                  className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSectionEdit(sectionKey)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {section.title || sectionKey.replace(/_/g, ' ')}
                      </h4>
                      <div className="text-sm text-gray-500">
                        Position: X: {section.position?.x || 0}, Y: {section.position?.y || 0}
                      </div>
                    </div>
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSectionEdit(sectionKey);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            onClick={handleAddSection}
            className="mt-4 w-full py-2 flex items-center justify-center text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Section
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => {
            if (editingSection) {
              setEditingSection(null);
            } else {
              onPreview();
            }
          }}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {editingSection ? 'Back to Sections' : 'Preview'}
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save CV
        </button>
      </div>
    </div>
  );
};

CVEditor.propTypes = {
  cvData: PropTypes.shape({
    name: PropTypes.string,
    jsonData: PropTypes.string,
    templateId: PropTypes.number
  }).isRequired,
  setCVData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onPreview: PropTypes.func.isRequired
};

export default CVEditor;