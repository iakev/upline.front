import React, { HTMLAttributes } from 'react';

// Define the props for the Text component, extending standard HTML paragraph attributes
// interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
//   // Add any custom props specific to your design system if needed later
//   // e.g., different text sizes, weights, colors
// }

// Use the base type directly as TextProps was empty
type TextProps = HTMLAttributes<HTMLParagraphElement>;

/**
 * Basic Text Component
 * Renders a standard HTML paragraph (<p>) element.
 * Useful for displaying descriptions, help text, or errors within forms.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Text: React.FC<TextProps> = ({ className, children, ...props }) => {
  // Basic Tailwind styles for descriptive text within forms
  const baseStyles = 'text-sm text-gray-600 dark:text-gray-400';

  return (
    <p className={`${baseStyles} ${className || ''}`.trim()} {...props}>
      {children}
    </p>
  );
};

// Set display name for React DevTools
Text.displayName = 'Text';
