import React, { useState } from 'react';
import { Search } from 'lucide-react';

const JOB_CATEGORIES = [
  { value: 'IT', label: 'IT' },
  { value: 'SOFTWARE_DEVELOPMENT', label: 'Software Development' },
  { value: 'DATA_SCIENCE', label: 'Data Science' },
  { value: 'MACHINE_LEARNING', label: 'Machine Learning' },
  { value: 'WEB_DEVELOPMENT', label: 'Web Development' },
  { value: 'SALES', label: 'Sales' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'ACCOUNTING', label: 'Accounting' },
  { value: 'GRAPHIC_DESIGN', label: 'Graphic Design' },
  { value: 'CONTENT_WRITING', label: 'Content Writing' },
  { value: 'MEDICAL', label: 'Medical' },
  { value: 'TEACHING', label: 'Teaching' },
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'PRODUCTION', label: 'Production' },
  { value: 'LOGISTICS', label: 'Logistics' },
  { value: 'HOSPITALITY', label: 'Hospitality' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'LAW', label: 'Law' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'HUMAN_RESOURCES', label: 'Human Resources' },
  { value: 'CUSTOMER_SERVICE', label: 'Customer Service' },
  { value: 'ADMINISTRATION', label: 'Administration' },
  { value: 'MANAGEMENT', label: 'Management' },
  { value: 'OTHER', label: 'Other' }
];

const JOB_TYPES = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'TEMPORARY', label: 'Temporary' },
  { value: 'VOLUNTEER', label: 'Volunteer' },
  { value: 'FREELANCE', label: 'Freelance' }
];

const JobFilter = ({ onFilterChange,initKeyword }) => {
  const [filters, setFilters] = useState({
    keyword: initKeyword,
    area: '',
    jobType: '',
    experience: '',
    category: '',
    minSalary: '',
    maxSalary: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onFilterChange(filters);
  };

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Bộ lọc công việc
      </h2>
      
      <div className="space-y-4">
        {/* Keyword search */}
        <div>
          <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
            Từ khóa
          </label>
          <input
            id="keyword"
            name="keyword"
            type="text"
            value={filters.keyword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tên công việc, kỹ năng..."
          />
        </div>
        
        {/* Area */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
            Khu vực
          </label>
          <select
            id="area"
            name="area"
            value={filters.area}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Tất cả khu vực</option>
            <option value="hcm">HCM</option>
            <option value="hn">HN</option>
            <option value="dn">DN</option>
          </select>
        </div>
        
        {/* Job Type */}
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
            Loại công việc
          </label>
          {/* <select
            id="jobType"
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Tất cả loại</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Remote">Remote</option>
            <option value="Freelance">Freelance</option>
          </select> */}
          <select
            id="jobType"
            name="jobType"
            value={filters.jobType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Tất cả loại</option>
            {JOB_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </ select>
        </div>
        
        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Kinh nghiệm
          </label>
          <select
            id="experience"
            name="experience"
            value={filters.experience}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Tất cả kinh nghiệm</option>
            <option value="ENTRY_LEVEL">Entry Level</option>
            <option value="MID_LEVEL">Mid Level</option>
            <option value="SENIOR_LEVEL">Senior Level</option>
            <option value="EXECUTIVE">Executive</option>
            <option value="NO_EXPERIENCE">No Experience</option>
            <option value="INTERN">Intern</option>
            <option value="FRESHER">Fresher</option>
          </select>
        </div>
        
        {/* Category - Now using a dropdown */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Ngành nghề
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          >
            <option value="">Tất cả ngành nghề</option>
            {JOB_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Lương tối thiểu
            </label>
            <input
              id="minSalary"
              name="minSalary"
              type="number"
              value={filters.minSalary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="VND"
            />
          </div>
          <div>
            <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Lương tối đa
            </label>
            <input
              id="maxSalary"
              name="maxSalary"
              type="number"
              value={filters.maxSalary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="VND"
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
        >
          <Search className="w-4 h-4 mr-2" />
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default JobFilter;