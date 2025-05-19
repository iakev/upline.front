import React, { HTMLAttributes } from 'react';

// Define the props for the FieldGroup component, extending standard HTML div attributes
// interface FieldGroupProps extends HTMLAttributes<HTMLDivElement> {
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as FieldGroupProps was empty
type FieldGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Basic FieldGroup Component
 * Renders a standard HTML div element.
 * Intended to group multiple Fields within a Fieldset, often for layout purposes (e.g., grid).
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const FieldGroup: React.FC<FieldGroupProps> = ({ className, children, ...props }) => {
  // No base styles needed by default, layout is controlled by parent (FormFields gridClass or specific className)
  const baseStyles = '';

  return (
    <div className={`${baseStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </div>
  );
};

// Set display name for React DevTools
FieldGroup.displayName = 'FieldGroup';
