import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const Breadcrumb = ({
  items = [],
  className,
  separator = <ChevronRight size={16} className="text-gray-400" />,
  ...props
}) => {
  return (
    <nav className={cn('flex items-center space-x-2', className)} {...props}>
      {items.map((item, index) => (
        <React.Fragment key={item.href || index}>
          {index > 0 && <span className="text-gray-400">{separator}</span>}
          {item.href ? (
            <Link
              to={item.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;