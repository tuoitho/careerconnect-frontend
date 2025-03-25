import React from 'react';
import { cn } from '../../utils/cn';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  className,
  required = false,
  disabled = false,
  ...props
}) => {
  const baseStyles = 'block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900';
  
  const selectClasses = cn(
    baseStyles,
    'px-3 py-2 pr-8 appearance-none bg-white bg-no-repeat bg-right',
    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
    disabled && 'bg-gray-100 cursor-not-allowed',
    className
  );

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={selectClasses}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Select;