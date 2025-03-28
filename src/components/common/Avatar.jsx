import React from 'react';
import { cn } from '../../utils/cn';

const Avatar = ({
  src,
  alt,
  size = 'md',
  className,
  fallback,
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const [error, setError] = React.useState(false);

  const handleError = () => {
    setError(true);
  };

  const renderFallback = () => {
    if (typeof fallback === 'string') {
      return (
        <div
          className={cn(
            'flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-medium uppercase',
            sizes[size]
          )}
        >
          {fallback.slice(0, 2)}
        </div>
      );
    }
    return fallback;
  };

  if (error || !src) {
    return renderFallback();
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={cn(
        'rounded-full object-cover',
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export default Avatar;