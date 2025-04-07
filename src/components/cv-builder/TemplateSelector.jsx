import React from 'react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'A clean and contemporary design with a focus on visual hierarchy',
    thumbnail: '/templates/modern-thumb.svg'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout suitable for all industries',
    thumbnail: '/templates/classic-thumb.svg'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design that lets your content stand out',
    thumbnail: '/templates/minimal-thumb.svg'
  }
];

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Choose Template</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'hover:border-gray-300'}`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div className="aspect-w-3 aspect-h-4 mb-3">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="object-cover rounded"
              />
            </div>
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;