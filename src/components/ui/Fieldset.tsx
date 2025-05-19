import React, { FieldsetHTMLAttributes } from 'react';

// Define the props for the Fieldset component, extending standard HTML fieldset attributes
// interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as FieldsetProps was empty
type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement>;

/**
 * Basic Fieldset Component
 * Renders a standard HTML fieldset element.
 * Used to group related controls within a form.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Fieldset: React.FC<FieldsetProps> = ({ className, children, ...props }) => {
  // Basic Tailwind styles for fieldset - provides padding and border
  const baseStyles = 'border border-gray-300 dark:border-gray-600 rounded-md p-4';
  // Disabled styles
  const disabledStyles = 'disabled:opacity-70'; // Slightly different disabled look for container

  return (
    <fieldset className={`${baseStyles} ${disabledStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </fieldset>
  );
};

// Set display name for React DevTools
Fieldset.displayName = 'Fieldset';
