import React from 'react';
import { cn } from '../../utils/cn';

const Tab = ({
  tabs = [],
  activeTab,
  onTabChange,
  className,
  variant = 'default',
  ...props
}) => {
  const baseStyles = 'flex space-x-1';
  
  const variants = {
    default: 'border-b border-gray-200',
    pills: 'bg-gray-100 p-1 rounded-lg',
  };

  const getTabStyles = (isActive) => {
    if (variant === 'pills') {
      return cn(
        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-white shadow text-gray-900'
          : 'text-gray-500 hover:text-gray-700'
      );
    }

    return cn(
      'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
      isActive
        ? 'border-black text-gray-900'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    );
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={getTabStyles(activeTab === tab.id)}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          {tab.icon && (
            <tab.icon
              className={cn(
                'w-5 h-5 mr-2',
                activeTab === tab.id ? 'text-gray-900' : 'text-gray-400'
              )}
              aria-hidden="true"
            />
          )}
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'ml-2 rounded-full px-2.5 py-0.5 text-xs font-medium',
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Tab;