// These are common CV-related types
export const CVStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

// Types for CV data structure
export const CVSectionTypes = {
  PERSONAL_INFO: 'personal_info',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  LANGUAGES: 'languages',
  PROJECTS: 'projects',
  CERTIFICATIONS: 'certifications',
  CUSTOM: 'custom'
};

// Helper functions for CV feature
export const formatDateRange = (startDate, endDate, current = false) => {
  if (!startDate) return '';
  return `${startDate} - ${current ? 'Present' : endDate || ''}`;
};

export const getCVStatusLabel = (status) => {
  switch (status) {
    case CVStatus.DRAFT:
      return 'Draft';
    case CVStatus.PUBLISHED:
      return 'Published';
    case CVStatus.ARCHIVED:
      return 'Archived';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case CVStatus.DRAFT:
      return 'bg-yellow-100 text-yellow-800';
    case CVStatus.PUBLISHED:
      return 'bg-green-100 text-green-800';
    case CVStatus.ARCHIVED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};