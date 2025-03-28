import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({
  children,
  className,
  variant = 'default',
  padding = 'default',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-gray-200';
  
  const variants = {
    default: '',
    interactive: 'cursor-pointer transition-shadow duration-200',
    elevated: 'shadow-md',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    default: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hover ? 'hover:shadow-md transition-shadow duration-200' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;