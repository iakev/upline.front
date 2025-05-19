import React, { Suspense, lazy, ComponentType, ReactNode } from 'react';

// Basic Loading Indicator Component (customize as needed)
const DefaultLoadingIndicator: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px] text-gray-500 dark:text-gray-400">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span>Loading Section...</span>
  </div>
);

interface DynamicSectionProps {
  // A function that calls import() for the component
  // e.g., () => import('../components/SomeComponent/SomeComponent')
  componentLoader: () => Promise<{ default: ComponentType<any> }>;
  loadingFallback?: ReactNode; // Allow custom fallback
  // Pass any other props needed by the dynamically loaded component
  [key: string]: any;
}

/**
 * DynamicSection Component
 * Lazily loads a component using React.lazy and Suspense.
 * Shows a loading indicator while the component is being fetched.
 */
export const DynamicSection: React.FC<DynamicSectionProps> = ({
  componentLoader,
  loadingFallback = <DefaultLoadingIndicator />,
  ...rest // Pass remaining props to the loaded component
}) => {
  // Use React.lazy with the provided loader function
  const LazyComponent = lazy(componentLoader);

  return (
    <Suspense fallback={loadingFallback}>
      <LazyComponent {...rest} />
    </Suspense>
  );
};

DynamicSection.displayName = 'DynamicSection';
