import React from 'react';
import { cn } from '../../utils/cn';

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  error,
  className,
  disabled = false,
  required = false,
  ...props
}) => {
  const baseStyles = 'h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500';
  
  const checkboxClasses = cn(
    baseStyles,
    disabled && 'cursor-not-allowed opacity-50',
    error && 'border-red-500',
    className
  );

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label
            htmlFor={name}
            className={cn(
              'font-medium text-gray-700',
              disabled && 'opacity-50 cursor-not-allowed',
              error && 'text-red-500'
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;