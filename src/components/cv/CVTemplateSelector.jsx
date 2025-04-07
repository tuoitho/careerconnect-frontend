import React, { useState } from "react";
import PropTypes from "prop-types";
import DEFAULT_CV_TEMPLATES from "../../data/defaultCVTemplates";

const CVTemplateSelector = ({ templates, onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use provided templates or fallback to default templates if none are available
  // const availableTemplates = templates && templates.length > 0 ? templates : DEFAULT_CV_TEMPLATES;
  const availableTemplates =DEFAULT_CV_TEMPLATES;

  // Extract unique categories from templates
  const categories = ["all", ...new Set(availableTemplates.map(template => template.category))];

  // Filter templates based on selected category and search query
  const filteredTemplates = availableTemplates.filter(template => {
    const categoryMatch = selectedCategory === "all" || template.category === selectedCategory;
    const searchMatch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-4">Choose a Template</h2>
      
      <div className="flex flex-col md:flex-row justify-between mb-6">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 text-sm rounded-full capitalize ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Search input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      {/* Templates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map(template => (
            <div
              key={template.templateId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onSelect(template)}
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {template.thumbnailUrl ? (
                  <img
                    src={template.thumbnailUrl}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>No preview available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{template.name}</h3>
                <p className="text-gray-600 text-sm">{template.description}</p>
                <div className="mt-2">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded capitalize">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No templates found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

CVTemplateSelector.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      templateId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      thumbnailUrl: PropTypes.string,
      category: PropTypes.string
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default CVTemplateSelector;