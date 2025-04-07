// CV templates for the feature-cv module
export const cvTemplates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A clean, traditional CV layout with a professional look',
    thumbnailUrl: '/assets/images/cv-templates/classic.jpg',
    category: 'professional'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'A contemporary design with a clean layout and modern typography',
    thumbnailUrl: '/assets/images/cv-templates/modern.jpg',
    category: 'creative'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A simple, minimalist design focusing on content clarity',
    thumbnailUrl: '/assets/images/cv-templates/minimal.jpg',
    category: 'professional'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'A bold design for those wanting to stand out',
    thumbnailUrl: '/assets/images/cv-templates/creative.jpg',
    category: 'creative'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional template for senior positions',
    thumbnailUrl: '/assets/images/cv-templates/executive.jpg',
    category: 'professional'
  }
];

// Map template IDs to render functions if needed
export const templateRenderFunctions = {
  // Example implementation for a specific template
  creative: (cvData) => {
    return (
      <div className="creative-template p-8 bg-gradient-to-r from-purple-100 to-blue-100">
        <header className="mb-8 pb-4 border-b-2 border-purple-300">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">{cvData.personalInfo.fullName}</h1>
          <p className="text-xl text-purple-600 mb-3">{cvData.personalInfo.title}</p>
          
          <div className="flex flex-wrap text-sm text-gray-700">
            {cvData.personalInfo.email && (
              <div className="mr-4 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{cvData.personalInfo.email}</span>
              </div>
            )}
            {cvData.personalInfo.phone && (
              <div className="mr-4 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{cvData.personalInfo.phone}</span>
              </div>
            )}
            {cvData.personalInfo.location && (
              <div className="mr-4 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{cvData.personalInfo.location}</span>
              </div>
            )}
            {cvData.personalInfo.website && (
              <div className="mr-4 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>{cvData.personalInfo.website}</span>
              </div>
            )}
          </div>
          
          {cvData.personalInfo.summary && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 italic">{cvData.personalInfo.summary}</p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Experience section */}
            {cvData.experiences && cvData.experiences.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">Work Experience</h2>
                {cvData.experiences.map((exp, index) => (
                  <div key={exp.id || index} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between flex-wrap">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600">{exp.title}</h3>
                        <p className="text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                      </div>
                      <div className="text-gray-600 text-sm bg-purple-100 px-3 py-1 rounded-full">
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
            {cvData.education && cvData.education.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">Education</h2>
                {cvData.education.map((edu, index) => (
                  <div key={edu.id || index} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between flex-wrap">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600">{edu.degree}</h3>
                        <p className="text-gray-700">{edu.institution}{edu.location ? `, ${edu.location}` : ''}</p>
                      </div>
                      <div className="text-gray-600 text-sm bg-purple-100 px-3 py-1 rounded-full">
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
          </div>

          <div className="md:col-span-1">
            {/* Skills section */}
            {cvData.skills && cvData.skills.length > 0 && (
              <section className="mb-8 bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-purple-700 border-b-2 border-purple-200 pb-2">Skills</h2>
                <div className="flex flex-wrap">
                  {cvData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }
};

// Export merged templates with their render functions
export const cvTemplatesWithRenderers = cvTemplates.map(template => {
  return {
    ...template,
    renderTemplate: templateRenderFunctions[template.id]
  };
});