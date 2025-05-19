import React, { HTMLAttributes } from 'react';

// Define the props for the Legend component, extending standard HTML legend attributes
// interface LegendProps extends HTMLAttributes<HTMLLegendElement> {
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as LegendProps was empty
type LegendProps = HTMLAttributes<HTMLLegendElement>;

/**
 * Basic Legend Component
 * Renders a standard HTML legend element.
 * Typically used as the first child of a Fieldset to provide a caption.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Legend: React.FC<LegendProps> = ({ className, children, ...props }) => {
  // Basic Tailwind styles for legend
  const baseStyles = '-ml-1 px-1 text-sm font-medium text-gray-900 dark:text-gray-100'; // Slight negative margin to align with border

  return (
    <legend className={`${baseStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </legend>
  );
};

// Set display name for React DevTools
Legend.displayName = 'Legend';
