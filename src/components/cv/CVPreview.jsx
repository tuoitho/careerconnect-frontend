import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CVPreview = ({ jsonData, template, fullPreview = false }) => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (jsonData) {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        setParsedData(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error parsing CV data:", error);
      setError("Invalid CV data format");
    }
  }, [jsonData]);

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p className="font-semibold">Error previewing CV</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-md">
        <div className="text-gray-400">CV preview not available</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${fullPreview ? 'w-full max-w-3xl mx-auto' : ''}`}>
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-semibold">CV Preview</h3>
        <div className="text-sm text-gray-500">
          {template ? template.name : 'Custom'} Template
        </div>
      </div>
      
      <div 
        className="p-8 bg-white" 
        style={{ 
          minHeight: '842px', // A4 height in pixels at 96 DPI
          width: '100%',
          position: 'relative',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Render CV content based on the JSON structure */}
        {parsedData.sections && Object.keys(parsedData.sections).map((sectionKey) => {
          const section = parsedData.sections[sectionKey];
          return (
            <div 
              key={sectionKey}
              style={{
                position: 'absolute',
                left: `${section.position?.x || 0}px`,
                top: `${section.position?.y || 0}px`,
                maxWidth: '500px',
                fontFamily: section.style?.fontFamily || 'Arial',
                fontSize: section.style?.fontSize || '12px',
                color: section.style?.color || '#000'
              }}
            >
              {section.title && (
                <h3 
                  style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {section.title}
                </h3>
              )}
              
              {/* Render content based on type */}
              {typeof section.content === 'string' ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>{section.content}</div>
              ) : (
                <div>
                  {Object.keys(section.content || {}).map((key) => (
                    <div key={key} style={{ marginBottom: '4px' }}>
                      {sectionKey === 'personal_info' ? (
                        // Special rendering for personal info section
                        <div>
                          {key === 'name' ? (
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
                              {section.content[key]}
                            </h2>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span style={{ marginRight: '8px', fontWeight: 'bold' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}:
                              </span>
                              <span>{section.content[key]}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Default rendering for other sections
                        <div style={{ display: 'flex' }}>
                          <span style={{ marginRight: '8px', fontWeight: 'bold' }}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>
                          <span>{section.content[key]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

CVPreview.propTypes = {
  jsonData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  template: PropTypes.shape({
    templateId: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    category: PropTypes.string
  }),
  fullPreview: PropTypes.bool
};

export default CVPreview;