import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  className,
  required = false,
  disabled = false,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 placeholder-gray-400';
  
  const inputClasses = cn(
    baseStyles,
    Icon && 'pl-10 pr-3',
    !Icon && 'px-3',
    'py-2',
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
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;