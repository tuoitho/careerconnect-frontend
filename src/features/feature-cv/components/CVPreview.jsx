import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const CVPreview = ({ cv, template, fullPreview = false }) => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (cv) {
        const data = typeof cv === 'string' ? JSON.parse(cv) : cv;
        setParsedData(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error parsing CV data:", error);
      setError("Invalid CV data format");
    }
  }, [cv]);

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

  // Basic template if no specific template is provided
  const renderBasicTemplate = () => (
    <div className="max-w-4xl mx-auto p-8" id="cv-preview">
      {/* Header with personal info */}
      <header className="mb-8 pb-4 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold mb-2">{parsedData.personalInfo.fullName}</h1>
        <p className="text-xl text-gray-600 mb-3">{parsedData.personalInfo.title}</p>
        
        <div className="flex flex-wrap text-sm text-gray-600">
          {parsedData.personalInfo.email && (
            <div className="mr-4 mb-2">
              <span className="font-semibold">Email: </span>
              <span>{parsedData.personalInfo.email}</span>
            </div>
          )}
          {parsedData.personalInfo.phone && (
            <div className="mr-4 mb-2">
              <span className="font-semibold">Phone: </span>
              <span>{parsedData.personalInfo.phone}</span>
            </div>
          )}
          {parsedData.personalInfo.location && (
            <div className="mr-4 mb-2">
              <span className="font-semibold">Location: </span>
              <span>{parsedData.personalInfo.location}</span>
            </div>
          )}
          {parsedData.personalInfo.website && (
            <div className="mr-4 mb-2">
              <span className="font-semibold">Website: </span>
              <span>{parsedData.personalInfo.website}</span>
            </div>
          )}
        </div>
        
        {parsedData.personalInfo.summary && (
          <div className="mt-4">
            <p className="text-gray-700">{parsedData.personalInfo.summary}</p>
          </div>
        )}
      </header>

      {/* Experience section */}
      {parsedData.experiences && parsedData.experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Work Experience</h2>
          {parsedData.experiences.map((exp, index) => (
            <div key={exp.id || index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="flex justify-between flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold">{exp.title}</h3>
                  <p className="text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                </div>
                <div className="text-gray-600 text-sm">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <p className="mt-2 text-gray-600 whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education section */}
      {parsedData.education && parsedData.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>
          {parsedData.education.map((edu, index) => (
            <div key={edu.id || index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="flex justify-between flex-wrap">
                <div>
                  <h3 className="text-lg font-semibold">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                </div>
                <div className="text-gray-600 text-sm">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </div>
              </div>
              {edu.description && (
                <p className="mt-2 text-gray-600">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills section */}
      {parsedData.skills && parsedData.skills.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills</h2>
          <div className="flex flex-wrap">
            {parsedData.skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Render template-based CV if a template is provided, otherwise use basic template
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${fullPreview ? 'w-full max-w-5xl mx-auto' : ''}`}>
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-semibold">CV Preview</h3>
        <div className="text-sm text-gray-500">
          {template ? template.name : 'Basic'} Template
        </div>
      </div>
      
      <div className="bg-white">
        {template && template.renderTemplate ? (
          // If the template has its own render function, use it
          template.renderTemplate(parsedData)
        ) : (
          // Otherwise use the basic template
          renderBasicTemplate()
        )}
      </div>
    </div>
  );
};

CVPreview.propTypes = {
  cv: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  template: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    renderTemplate: PropTypes.func
  }),
  fullPreview: PropTypes.bool
};

export default CVPreview;