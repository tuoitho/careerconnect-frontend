import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { defaultCV } from '../../../data/defaultCV';

const CVEditor = ({ cv, onCVChange, templates, selectedTemplate, onTemplateChange }) => {
  const handlePersonalInfoChange = (field, value) => {
    const updatedCV = {
      ...cv,
      personalInfo: {
        ...cv.personalInfo,
        [field]: value
      }
    };
    onCVChange(updatedCV);
  };
  console.log("day là",cv)
  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now().toString(), // Unique ID
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    const updatedCV = {
      ...cv,
      experiences: [...cv.experiences, newExperience]
    };
    
    onCVChange(updatedCV);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...cv.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    const updatedCV = {
      ...cv,
      experiences: updatedExperiences
    };
    
    onCVChange(updatedCV);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = [...cv.experiences];
    updatedExperiences.splice(index, 1);
    
    const updatedCV = {
      ...cv,
      experiences: updatedExperiences
    };
    
    onCVChange(updatedCV);
  };

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(), // Unique ID
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    
    const updatedCV = {
      ...cv,
      education: [...cv.education, newEducation]
    };
    
    onCVChange(updatedCV);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...cv.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    const updatedCV = {
      ...cv,
      education: updatedEducation
    };
    
    onCVChange(updatedCV);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...cv.education];
    updatedEducation.splice(index, 1);
    
    const updatedCV = {
      ...cv,
      education: updatedEducation
    };
    
    onCVChange(updatedCV);
  };

  const handleAddSkill = () => {
    const updatedCV = {
      ...cv,
      skills: [...cv.skills, '']
    };
    
    onCVChange(updatedCV);
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...cv.skills];
    updatedSkills[index] = value;
    
    const updatedCV = {
      ...cv,
      skills: updatedSkills
    };
    
    onCVChange(updatedCV);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...cv.skills];
    updatedSkills.splice(index, 1);
    
    const updatedCV = {
      ...cv,
      skills: updatedSkills
    };
    
    onCVChange(updatedCV);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Template Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className={`border-2 rounded-md overflow-hidden cursor-pointer transition-all ${
                selectedTemplate?.id === template.id ? 'border-blue-600 scale-105' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => onTemplateChange(template)}
            >
              <img 
                src={template.thumbnailUrl} 
                alt={template.name} 
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mb-2">
              <span className="text-lg">Personal Information</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={cv.personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={cv.personalInfo.title}
                    onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={cv.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={cv.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={cv.personalInfo.location}
                    onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. New York, NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={cv.personalInfo.website}
                    onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. yourportfolio.com"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Summary
                </label>
                <textarea
                  value={cv.personalInfo.summary}
                  onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                  placeholder="Brief overview of your professional background and goals"
                />
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Work Experience */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mb-2">
              <span className="text-lg">Work Experience</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 mb-4">
              {cv.experiences.map((experience, index) => (
                <div key={experience.id || index} className="mb-6 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={experience.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={experience.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={experience.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={experience.startDate}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={experience.endDate}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="MM/YYYY or Present"
                          disabled={experience.current}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`current-job-${index}`}
                          checked={experience.current}
                          onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`current-job-${index}`} className="text-sm">
                          I currently work here
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Describe your responsibilities and achievements"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddExperience}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Add Experience
              </button>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Education */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mb-2">
              <span className="text-lg">Education</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 mb-4">
              {cv.education.map((education, index) => (
                <div key={education.id || index} className="mb-6 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={education.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g. Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={education.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={education.location}
                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="text"
                          value={education.startDate}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="text"
                          value={education.endDate}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="MM/YYYY or Present"
                          disabled={education.current}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`current-education-${index}`}
                          checked={education.current}
                          onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`current-education-${index}`} className="text-sm">
                          I'm currently studying here
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={education.description}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Relevant information about your studies, achievements, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddEducation}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Add Education
              </button>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* Skills */}
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 mb-2">
              <span className="text-lg">Skills</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform' : ''
                } h-5 w-5 text-blue-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 mb-4">
              <div className="space-y-3">
                {cv.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g. JavaScript, Project Management, etc."
                    />
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddSkill}
                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Add Skill
              </button>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default CVEditor;