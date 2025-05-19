import React, { HTMLAttributes } from 'react';

// Define the props for the Field component, extending standard HTML div attributes
// interface FieldProps extends HTMLAttributes<HTMLDivElement> {
//   // Add any custom props specific to your design system if needed later
//   // e.g., error state indication, required field marker
// }

// Use the base type directly as FieldProps was empty
type FieldProps = HTMLAttributes<HTMLDivElement>;

/**
 * Basic Field Component
 * Renders a standard HTML div element, intended to wrap a Label and its associated input control.
 * Acts as a structural container for form fields.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Field: React.FC<FieldProps> = ({ className, children, ...props }) => {
  // Basic Tailwind styles for field container - provides vertical spacing
  const baseStyles = 'mb-4'; // Margin bottom for spacing between fields

  return (
    <div
      className={`${baseStyles} ${className || ''}`.trim()} // Combine base styles (if any) with passed classes
      {...props}
    >
      {children}
    </div>
  );
};

// Set display name for React DevTools
Field.displayName = 'Field';
