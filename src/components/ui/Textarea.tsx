import React, { forwardRef, TextareaHTMLAttributes } from 'react';

// Define the props for the Textarea component, extending standard HTML textarea attributes
// interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
//   // Add any custom props specific to your design system if needed later
// }

// Use the base type directly as TextareaProps was empty
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Basic Textarea Component
 * Renders a standard HTML textarea element.
 * Forwards refs to the underlying textarea element.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  // Basic Tailwind styles for textarea fields
  const baseStyles =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500';
  // Disabled styles
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return <textarea ref={ref} className={`${baseStyles} ${disabledStyles} ${className || ''}`.trim()} {...props} />;
});

// Set display name for React DevTools
Textarea.displayName = 'Textarea';
