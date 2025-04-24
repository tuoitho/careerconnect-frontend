import React from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';

const FormField = React.forwardRef(({ 
  label, 
  name, 
  error, 
  required, 
  className,
  ...props 
}, ref) => {
  return (
    <div className={className}>
      <Label htmlFor={name} required={required} error={error}>
        {label}
      </Label>
      <div className="mt-1">
        <Input
          id={name}
          name={name}
          ref={ref}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export { FormField };