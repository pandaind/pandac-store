import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading Spinner Component
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary dark:text-light',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
  className: PropTypes.string,
};

/**
 * Loading Overlay Component
 */
export const LoadingOverlay = ({ 
  isLoading, 
  message = 'Loading...', 
  children 
}) => {
  if (!isLoading) {
    return children;
  }

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-semibold text-primary dark:text-light">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Full Page Loading Component
 */
export const FullPageLoading = ({ 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center justify-center min-h-[852px] bg-normalbg dark:bg-darkbg ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-6 text-2xl font-semibold text-primary dark:text-light">
          {message}
        </p>
      </div>
    </div>
  );
};

/**
 * Skeleton Loading Component
 */
export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  animated = true
}) => {
  const animationClass = animated ? 'animate-pulse' : '';
  
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${animationClass} ${className}`}
      style={{ width, height }}
    />
  );
};

/**
 * Card Skeleton for Product Cards
 */
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
      <Skeleton height="200px" className="rounded-lg" />
      <Skeleton height="1.5rem" width="80%" />
      <Skeleton height="1rem" width="60%" />
      <div className="flex justify-between items-center">
        <Skeleton height="1.25rem" width="40%" />
        <Skeleton height="2rem" width="80px" />
      </div>
    </div>
  );
};

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton height="1rem" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Higher-Order Component for Loading States
 */
export const withLoading = (WrappedComponent) => {
  const WithLoadingComponent = ({ isLoading, loadingMessage, ...props }) => {
    if (isLoading) {
      return <FullPageLoading message={loadingMessage} />;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithLoadingComponent.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithLoadingComponent;
};
