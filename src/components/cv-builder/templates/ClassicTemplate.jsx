import React from 'react';
import { defaultCV } from '../../../data/defaultCV';

const ClassicTemplate = ({ cv }) => {
  // Use defaultCV if cv is null or undefined
  const safeCV = cv || defaultCV;
  const { personalInfo = {}, education = [], experience = [], skills = [] } = safeCV;

  return (
    <div className="max-w-4xl mx-auto font-serif">
      {/* Header */}
      <header className="text-center border-b-2 border-gray-300 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl text-gray-600 mb-4">{personalInfo.title || 'Professional Title'}</p>
        <div className="flex justify-center gap-4 text-gray-600">
          <span>{personalInfo.email || 'email@example.com'}</span>
          <span>|</span>
          <span>{personalInfo.phone || '123-456-7890'}</span>
          <span>|</span>
          <span>{personalInfo.address || 'City, Country'}</span>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Professional Experience</h2>
        {experience.length > 0 ? (
          experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-gray-700">{exp.position || 'Position'}</h3>
                <span className="text-gray-600">{exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}</span>
              </div>
              <div className="text-gray-700 font-semibold mb-2">{exp.company || 'Company'}</div>
              <p className="text-gray-600">{exp.description || 'Job description'}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No experience listed</p>
        )}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Education</h2>
        {education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-xl font-bold text-gray-700">{edu.degree || 'Degree'}</h3>
                <span className="text-gray-600">{edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}</span>
              </div>
              <div className="text-gray-700 font-semibold">{edu.school || 'School/University'}</div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No education listed</p>
        )}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">Skills</h2>
        {skills.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{skill.name || 'Skill'}</span>
                <span className="text-gray-600">{skill.level || 'Beginner'}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No skills listed</p>
        )}
      </section>
    </div>
  );
};

export default ClassicTemplate;