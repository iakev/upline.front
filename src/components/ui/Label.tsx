import React, { LabelHTMLAttributes } from 'react';

// Define the props for the Label component, extending standard HTML label attributes
// interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as LabelProps was empty
type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

/**
 * Basic Label Component
 * Renders a standard HTML label element.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Label: React.FC<LabelProps> = ({ className, children, ...props }) => {
  // Basic Tailwind styles for labels
  const baseStyles = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <label className={`${baseStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </label>
  );
};

// Set display name for React DevTools
Label.displayName = 'Label';
