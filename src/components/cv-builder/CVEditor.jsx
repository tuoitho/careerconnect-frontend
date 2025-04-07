import React, { useEffect } from 'react';
import cvService from '../../services/cvService';
import { toast } from 'react-toastify';
import { defaultCV } from '../../data/defaultCV';

const CVEditor = ({ cv, onUpdate, cvId, templateId = "modern" }) => {
  // Ensure we have a valid CV object with all required sections
  useEffect(() => {
    if (!cv || !cv.personalInfo) {
      onUpdate(defaultCV);
    }
  }, [cv, onUpdate]);

  // If cv is null or undefined, use defaultCV to prevent errors
  const safeCV = cv || defaultCV;

  const handleSave = async () => {
    try {
      // Convert the CV object to a string before saving
      const cvData = {
        name: safeCV.personalInfo?.fullName || "Untitled CV",
        templateId: templateId, // Use the templateId from props
        content: JSON.stringify(safeCV)
      };

      if (cvId) {
        await cvService.updateCV(cvId, cvData);
        toast.success('CV updated successfully');
      } else {
        const response = await cvService.createCV(cvData);
        toast.success('CV saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save CV');
      console.error('Error saving CV:', error);
    }
  };
  
  const handleChange = (section, field, value) => {
    onUpdate({
      ...safeCV,
      [section]: {
        ...safeCV[section],
        [field]: value
      }
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    const newArray = [...(safeCV[section] || [])];
    newArray[index] = {
      ...newArray[index],
      [field]: value
    };
    onUpdate({
      ...safeCV,
      [section]: newArray
    });
  };

  const addItem = (section) => {
    onUpdate({
      ...safeCV,
      [section]: [...(safeCV[section] || []), {}]
    });
  };

  const removeItem = (section, index) => {
    onUpdate({
      ...safeCV,
      [section]: (safeCV[section] || []).filter((_, i) => i !== index)
    });
  };

  // If CV is still null after all our safeguards, show a loading state
  if (!safeCV || !safeCV.personalInfo) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Edit CV</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {cvId ? 'Update CV' : 'Save CV'}
        </button>
      </div>
      
      {/* Personal Information */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={safeCV.personalInfo.fullName || ''}
              onChange={(e) => handleChange('personalInfo', 'fullName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={safeCV.personalInfo.email || ''}
              onChange={(e) => handleChange('personalInfo', 'email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={safeCV.personalInfo.phone || ''}
              onChange={(e) => handleChange('personalInfo', 'phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={safeCV.personalInfo.address || ''}
              onChange={(e) => handleChange('personalInfo', 'address', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Professional Title</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={safeCV.personalInfo.title || ''}
              onChange={(e) => handleChange('personalInfo', 'title', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Professional Summary</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows="4"
              value={safeCV.personalInfo.summary || ''}
              onChange={(e) => handleChange('personalInfo', 'summary', e.target.value)}
            />
          </div>
        </div>
      </section>
      
      {/* Education */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Education</h3>
          <button
            onClick={() => addItem('education')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Education
          </button>
        </div>
        {(safeCV.education || []).map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeItem('education', index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">School/University</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={edu.school || ''}
                  onChange={(e) => handleArrayChange('education', index, 'school', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree/Certificate</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={edu.degree || ''}
                  onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={edu.startDate || ''}
                    onChange={(e) => handleArrayChange('education', index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={edu.endDate || ''}
                    onChange={(e) => handleArrayChange('education', index, 'endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      
      {/* Experience */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Experience</h3>
          <button
            onClick={() => addItem('experience')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Experience
          </button>
        </div>
        {(safeCV.experience || []).map((exp, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeItem('experience', index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={exp.company || ''}
                  onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={exp.position || ''}
                  onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={exp.startDate || ''}
                    onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={exp.endDate || ''}
                    onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="3"
                  value={exp.description || ''}
                  onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Skills</h3>
          <button
            onClick={() => addItem('skills')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Skill
          </button>
        </div>
        {(safeCV.skills || []).map((skill, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => removeItem('skills', index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={skill.name || ''}
                  onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={skill.level || 'Beginner'}
                  onChange={(e) => handleArrayChange('skills', index, 'level', e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CVEditor;