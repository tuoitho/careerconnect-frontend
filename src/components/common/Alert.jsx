import React from 'react';
import { cn } from '../../utils/cn';

const Alert = ({
  children,
  className,
  variant = 'info',
  icon: Icon,
  dismissible = false,
  onDismiss,
  ...props
}) => {
  const baseStyles = 'flex items-center p-4 rounded-lg';
  
  const variants = {
    info: 'bg-blue-50 text-blue-800',
    success: 'bg-green-50 text-green-800',
    warning: 'bg-yellow-50 text-yellow-800',
    error: 'bg-red-50 text-red-800',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      role="alert"
      {...props}
    >
      {Icon && (
        <Icon className="w-5 h-5 mr-2" />
      )}
      <div className="flex-1">{children}</div>
      {dismissible && onDismiss && (
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 inline-flex h-8 w-8 hover:bg-gray-100"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;