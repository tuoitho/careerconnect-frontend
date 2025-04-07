import React from 'react';
import { defaultCV } from '../../../data/defaultCV';

const ModernTemplate = ({ cv }) => {
  // Use defaultCV if cv is null or undefined
  const safeCV = cv || defaultCV;
  const { personalInfo = {}, education = [], experience = [], skills = [] } = safeCV;

  return (
    <div className="max-w-4xl mx-auto font-sans">
      {/* Header */}
      <header className="bg-blue-600 text-white p-8 rounded-t-lg">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl mb-4">{personalInfo.title || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>{personalInfo.email || 'email@example.com'}</span>
          <span>•</span>
          <span>{personalInfo.phone || '123-456-7890'}</span>
          <span>•</span>
          <span>{personalInfo.address || 'City, Country'}</span>
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="bg-gray-50 p-8">
          <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Professional Experience</h2>
            {experience.length > 0 ? (
              experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">{exp.position || 'Position'}</h3>
                  <div className="text-blue-600 font-medium">{exp.company || 'Company'}</div>
                  <div className="text-gray-500 text-sm mb-2">
                    {exp.startDate || 'Start Date'} - {exp.endDate || 'Present'}
                  </div>
                  <p className="text-gray-700">{exp.description || 'Job description'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No experience listed</p>
            )}
          </section>

          {/* Education */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
            {education.length > 0 ? (
              education.map((edu, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-700">{edu.degree || 'Degree'}</h3>
                  <div className="text-blue-600 font-medium">{edu.school || 'School/University'}</div>
                  <div className="text-gray-500 text-sm">
                    {edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No education listed</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="col-span-1">
          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
            {skills.length > 0 ? (
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-gray-700 mb-1">
                      <span className="font-medium">{skill.name || 'Skill'}</span>
                      <span className="text-gray-500">{skill.level || 'Beginner'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: (() => {
                            switch (skill.level) {
                              case 'Beginner': return '25%';
                              case 'Intermediate': return '50%';
                              case 'Advanced': return '75%';
                              case 'Expert': return '100%';
                              default: return '25%';
                            }
                          })()
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No skills listed</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;