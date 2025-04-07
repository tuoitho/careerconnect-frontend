import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { toast } from 'react-toastify';
import cvService from '../service';
import CVEditor from './CVEditor';
import CVPreview from './CVPreview';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const CVBuilder = ({ initialCV, templates, existingCVId }) => {
  const [cv, setCV] = useState(initialCV);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0] || null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cvName, setCvName] = useState(initialCV.name || 'My CV');
  const navigate = useNavigate();

  const handleSave = async (makeDefault = false) => {
    try {
      setSaving(true);
      const cvData = {
        name: cvName,
        content: JSON.stringify(cv),
        setAsDefault: makeDefault
      };

      if (existingCVId) {
        // Update existing CV
        await cvService.updateCV(existingCVId, cvData);
        toast.success('CV updated successfully');
      } else {
        // Create new CV
        const templateId = selectedTemplate?.id;
        const newCVData = {
          name: cvName,
          content: JSON.stringify(cv),
          templateId: templateId
        };
        const result = await cvService.createCV(newCVData);
        toast.success('CV created successfully');
        // Redirect to the edit page for the new CV
        navigate(`/cv/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('Failed to save CV. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCVChange = (updatedCV) => {
    setCV(updatedCV);
  };

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      if (existingCVId) {
        // For existing CVs, use the API to generate a PDF
        const pdfBlob = await cvService.generatePDF(existingCVId);
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cvName || 'cv'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('CV downloaded as PDF');
      } else {
        // For unsaved CVs, show a message to save first
        toast.info('Please save your CV before downloading');
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="text"
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded-md mr-2 focus:border-blue-500 focus:outline-none"
            placeholder="CV Name"
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {saving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {saving ? 'Saving...' : 'Save as Default'}
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {downloading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Edit
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Preview
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <CVEditor 
              cv={cv} 
              onCVChange={handleCVChange} 
              templates={templates}
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />
          </Tab.Panel>
          <Tab.Panel>
            <CVPreview cv={cv} template={selectedTemplate} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CVBuilder;