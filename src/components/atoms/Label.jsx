import React from 'react';
import { cn } from '../../utils/cn';

const Label = React.forwardRef(({ className, children, required, error, ...props }, ref) => {
  return (
    <label
      className={cn(
        'text-sm font-medium text-gray-700',
        error && 'text-red-500',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </label>
  );
});

Label.displayName = 'Label';

export { Label };