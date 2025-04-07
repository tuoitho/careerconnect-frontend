import React from 'react';
import { defaultCV } from '../../../data/defaultCV';

const MinimalTemplate = ({ cv }) => {
  // Use defaultCV if cv is null or undefined
  const safeCV = cv || defaultCV;
  const { personalInfo = {}, education = [], experience = [], skills = [] } = safeCV;

  return (
    <div className="max-w-4xl mx-auto font-sans bg-white">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-1">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600 mb-2">{personalInfo.title || 'Professional Title'}</p>
        <div className="text-sm text-gray-500 space-x-2">
          <span>{personalInfo.email || 'email@example.com'}</span>
          <span>·</span>
          <span>{personalInfo.phone || '123-456-7890'}</span>
          <span>·</span>
          <span>{personalInfo.address || 'City, Country'}</span>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-4">Experience</h2>
        {experience.length > 0 ? (
          experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-sm text-gray-500">
                  {exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}
                </div>
                <div className="col-span-3">
                  <h3 className="text-lg font-medium text-gray-900">{exp.position || 'Position'}</h3>
                  <p className="text-gray-600 mb-2">{exp.company || 'Company'}</p>
                  <p className="text-gray-700 text-sm">{exp.description || 'Job description'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No experience listed</p>
        )}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-4">Education</h2>
        {education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="mb-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 text-sm text-gray-500">
                  {edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}
                </div>
                <div className="col-span-3">
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree || 'Degree'}</h3>
                  <p className="text-gray-600">{edu.school || 'School/University'}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No education listed</p>
        )}
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-4">Skills</h2>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill.name || 'Skill'} - {skill.level || 'Beginner'}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No skills listed</p>
        )}
      </section>
    </div>
  );
};

export default MinimalTemplate;