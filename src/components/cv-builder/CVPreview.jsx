import React from 'react';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

const CVPreview = ({ cv, template }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate cv={cv} />;
      case 'classic':
        return <ClassicTemplate cv={cv} />;
      case 'minimal':
        return <MinimalTemplate cv={cv} />;
      default:
        return <ModernTemplate cv={cv} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        {renderTemplate()}
      </div>
      <div className="border-t p-4 bg-gray-50 flex justify-end space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          onClick={() => {
            // TODO: Implement PDF export
            console.log('Export to PDF');
          }}
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default CVPreview;