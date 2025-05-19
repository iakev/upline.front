import React, { forwardRef, InputHTMLAttributes } from 'react';

// Define the props for the Input component, extending standard HTML input attributes
// interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
//   // Add any custom props specific to your design system if needed later
//   // For now, we just extend the standard input attributes.
// }

// Use the base type directly as InputProps was empty
type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Basic Input Component
 * Renders a standard HTML input element.
 * Forwards refs to the underlying input element.
 * Styling is intended to be applied via Tailwind CSS classes passed in the className prop.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => {
  // Basic Tailwind styles for input fields
  const baseStyles =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500';
  // Disabled styles
  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return <input ref={ref} type={type} className={`${baseStyles} ${disabledStyles} ${className || ''}`.trim()} {...props} />;
});

// Set display name for React DevTools
Input.displayName = 'Input';
